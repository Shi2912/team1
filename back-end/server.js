import express from "express";
import cors from "cors";
import pool from "./service.js"; // ✅ Your MySQL pool

const app = express();
app.use(cors());
app.use(express.json());

console.log("✅ Server running");

// ==================== SIGNUP ====================
app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role)
    return res.status(400).json({ message: "Email, password, and role are required" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "User already exists" });

    await pool.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, password, role]);
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==================== LOGIN ====================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );
    if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", role: rows[0].role, userId: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==================== SERVICE CATEGORIES ====================
app.get("/service_categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT DISTINCT category FROM service_listings");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// ==================== SERVICES ====================
app.get("/services", async (req, res) => {
  const { category, location, search } = req.query;
  try {
    let query = `SELECT sl.*, u.email as provider_email 
                 FROM service_listings sl 
                 JOIN users u ON sl.provider_id = u.id 
                 WHERE 1=1`;
    const params = [];

    if (category) {
      query += " AND sl.category = ?";
      params.push(category);
    }
    if (location) {
      query += " AND (sl.city LIKE ? OR sl.zip_code LIKE ?)";
      params.push(`%${location}%`, `%${location}%`);
    }
    if (search) {
      query += " AND (sl.title LIKE ? OR sl.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.query(query, params);
    
    // Map the data to match frontend expectations
    const services = rows.map(service => ({
      id: service.id,
      service_name: service.title,
      description: service.description,
      category: service.category,
      price: service.price,
      location: service.location,
      city: service.city,
      zip_code: service.zip_code,
      availability: service.availability,
      provider_email: service.provider_email
    }));
    
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching services" });
  }
});

app.post("/services", async (req, res) => {
  const { provider_id, category, title, description, price, location, city, zip_code, availability } = req.body;
  if (!provider_id || !title) return res.status(400).json({ message: "Provider and title required" });

  try {
    const [result] = await pool.query(
      "INSERT INTO service_listings (provider_id, category, title, description, price, location, city, zip_code, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [provider_id, category, title, description, price, location, city, zip_code, availability]
    );
    res.json({ message: "Service created!", listingId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating service" });
  }
});

// ==================== BOOKINGS ====================
app.post("/book", async (req, res) => {
  const { userId, service_id, date, time } = req.body;
  if (!userId || !service_id || !date || !time) return res.status(400).json({ message: "All fields required" });

  try {
    // Prevent double booking
    const [existing] = await pool.query(
      "SELECT * FROM bookings WHERE service_id=? AND date=? AND time=?",
      [service_id, date, time]
    );
    if (existing.length > 0) return res.status(400).json({ message: "Slot already booked" });

    const [result] = await pool.query(
      "INSERT INTO bookings (user_id, service_id, date, time, status) VALUES (?, ?, ?, ?, 'Pending')",
      [userId, service_id, date, time]
    );
    
    res.json({ 
      message: "Booking confirmed!",
      booking_id: result.insertId // Return booking ID for ratings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error booking service" });
  }
});

// ==================== RATINGS / FEEDBACK ====================
// NEW: Rating by service_id (without booking)
app.post("/rate", async (req, res) => {
  const { service_id, rating, comment } = req.body;
  console.log("Rating request received:", { service_id, rating, comment });
  
  if (!service_id || !rating) {
    return res.status(400).json({ message: "Service and rating required" });
  }

  try {
    // First, verify the service exists
    const [service] = await pool.query("SELECT id FROM service_listings WHERE id = ?", [service_id]);
    if (service.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Insert rating directly with service_id
    const [result] = await pool.query(
      "INSERT INTO ratings (service_id, rating, comment) VALUES (?, ?, ?)",
      [service_id, rating, comment || '']
    );
    
    console.log("Rating inserted successfully:", result.insertId);
    res.json({ 
      message: "Rating submitted successfully!",
      rating_id: result.insertId 
    });
  } catch (err) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ message: "Error submitting rating" });
  }
});

// Alternative: Rating with booking_id (keep this for compatibility)
app.post("/rate-booking", async (req, res) => {
  const { booking_id, rating, comment } = req.body;
  if (!booking_id || !rating) return res.status(400).json({ message: "Booking and rating required" });

  try {
    await pool.query(
      "INSERT INTO ratings (booking_id, rating, comment) VALUES (?, ?, ?)",
      [booking_id, rating, comment]
    );
    res.json({ message: "Rating submitted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error submitting rating" });
  }
});

app.get("/ratings/:service_id", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT rating, comment, created_at 
      FROM ratings 
      WHERE service_id = ?
      ORDER BY created_at DESC
    `, [req.params.service_id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings" });
  }
});

// ==================== ADMIN PANEL ====================
app.post("/admin/approve-provider", async (req, res) => {
  const { provider_id, approve } = req.body; // approve = 1 or 0
  try {
    await pool.query("UPDATE users SET approved=? WHERE id=?", [approve, provider_id]);
    res.json({ message: "Provider approval updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating provider approval" });
  }
});

app.get("/admin/analytics/top-services", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sl.title, COUNT(b.id) as bookings_count
      FROM bookings b
      JOIN service_listings sl ON b.service_id = sl.id
      GROUP BY sl.id
      ORDER BY bookings_count DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

// ==================== TEST ENDPOINT ====================
app.get("/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date() });
});

// ==================== START SERVER ====================
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
// Admin endpoints
app.get("/admin/pending-services", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sl.*, u.email as provider_email 
      FROM service_listings sl 
      JOIN users u ON sl.provider_id = u.id 
      WHERE sl.status = 'pending'
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending services" });
  }
});

app.post("/admin/approve-service", async (req, res) => {
  const { service_id, action } = req.body; // action: 'approve' or 'reject'
  try {
    await pool.query(
      "UPDATE service_listings SET status = ? WHERE id = ?",
      [action === 'approve' ? 'approved' : 'rejected', service_id]
    );
    res.json({ message: `Service ${action}d successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error updating service" });
  }
});

app.get("/admin/analytics", async (req, res) => {
  try {
    const [topCategories] = await pool.query(`
      SELECT sl.category, COUNT(b.id) as bookings 
      FROM bookings b 
      JOIN service_listings sl ON b.service_id = sl.id 
      GROUP BY sl.category 
      ORDER BY bookings DESC 
      LIMIT 5
    `);
    
    const [topServices] = await pool.query(`
      SELECT sl.service_name, COUNT(b.id) as bookings 
      FROM bookings b 
      JOIN service_listings sl ON b.service_id = sl.id 
      GROUP BY sl.id 
      ORDER BY bookings DESC 
      LIMIT 5
    `);
    
    res.json({ topCategories, topServices });
  } catch (err) {
    res.status(500).json({ message: "Error fetching analytics" });
  }
});