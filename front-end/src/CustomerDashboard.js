import React, { useState, useEffect } from "react";
import "./CustomerDashboard.css";
import BookingCalendar from "./BookingCalendar";


// Booking Form Component
const BookingForm = ({ service, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !phone || !address || !date || !time) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log("Booking service:", service.id, { name, phone, address, date, time });
      setSuccess("Booking confirmed! 🎉");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to book service. Try again.");
    }
  };

  return (
    <div className="booking-modal">
      <div className="booking-modal-content" style={{
        width: "50vw",        // half the page width
        minHeight: "50vh",    // half the page height
        borderRadius: "15px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        overflow: "hidden",
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        margin: "5vh auto"    // vertically centered
      }}>
        <div style={{
          background: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
          color: "#fff",
          padding: "25px",
          textAlign: "center",
          position: "relative"
        }}>
          <span
            className="close"
            onClick={onClose}
            style={{ position: "absolute", top: "15px", right: "20px", fontSize: "1.8rem", cursor: "pointer", color: "#fff" }}
          >
            &times;
          </span>
          <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            Book This Service
          </h2>
          <p style={{ margin: "10px 0 0 0", opacity: 0.9, fontSize: "1.1rem" }}>
            {service.service_name}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          padding: "30px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #d3cce3 100%)"
        }}>
          {error && (
            <div style={{
              color: "#e74c3c",
              backgroundColor: "#ffeaea",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #e74c3c",
              textAlign: "center",
              fontWeight: "bold"
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              color: "#27ae60",
              backgroundColor: "#eafaf1",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              border: "1px solid #27ae60",
              textAlign: "center",
              fontWeight: "bold"
            }}>
              {success}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#2c3e50" }}>Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "1rem" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#2c3e50" }}>Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "1rem" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#2c3e50" }}>Home Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your Address" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "1rem" }} />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#2c3e50" }}>Select Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "1rem" }} />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px", fontSize: "1.1rem", color: "#2c3e50" }}>Select Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "2px solid #ddd", fontSize: "1rem" }} />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "15px", background: "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              Cancel
            </button>
            <button type="submit" style={{ flex: 1, padding: "15px", background: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Rating Form Component
const RatingForm = ({ service, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    try {
      console.log("Submitting rating for service:", service.id);
      setSuccess("Thank you for your rating! 😊");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Network error:", err);
      setSuccess("Thank you for your rating! 😊");
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const StarRating = ({ currentRating, onRatingChange, hoverRating, onHoverChange }) => {
    return (
      <div className="star-rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= (hoverRating || currentRating) ? 'active' : ''}`}
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHoverChange(star)}
            onMouseLeave={() => onHoverChange(0)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              margin: '0 2px'
            }}
          >
            {star <= (hoverRating || currentRating) ? '★' : '☆'}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="booking-modal">
      <div className="booking-modal-content" style={{ maxWidth: "500px", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", padding: "25px", textAlign: "center", position: "relative" }}>
          <span 
            className="close" 
            onClick={onClose}
            style={{ position: "absolute", top: "15px", right: "20px", fontSize: "1.8rem", cursor: "pointer", color: "#fff" }}
          >
            &times;
          </span>
          <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            Rate This Service
          </h2>
          <p style={{ margin: "10px 0 0 0", opacity: 0.9, fontSize: "1.1rem" }}>
            {service.service_name}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "30px", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
          {error && <div style={{ color: "#e74c3c", backgroundColor: "#ffeaea", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #e74c3c", textAlign: "center", fontWeight: "bold" }}>{error}</div>}
          {success && <div style={{ color: "#27ae60", backgroundColor: "#eafaf1", padding: "12px", borderRadius: "8px", marginBottom: "20px", border: "1px solid #27ae60", textAlign: "center", fontWeight: "bold" }}>{success}</div>}

          <div style={{ marginBottom: "25px", textAlign: "center" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "15px", fontSize: "1.2rem", color: "#2c3e50" }}>How would you rate this service?</label>
            <StarRating currentRating={rating} onRatingChange={setRating} hoverRating={hoverRating} onHoverChange={setHoverRating} />
            <div style={{ marginTop: "10px", fontSize: "1.1rem", color: "#667eea", fontWeight: "bold" }}>
              {rating} Star{rating !== 1 ? 's' : ''} Selected
            </div>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "10px", fontSize: "1.1rem", color: "#2c3e50" }}>Your Feedback</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience..." style={{ width: "100%", padding: "15px", borderRadius: "10px", border: "2px solid #ddd", fontSize: "1rem", minHeight: "120px", resize: "vertical", fontFamily: "inherit" }} />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: "15px", background: "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>Cancel</button>
            <button type="submit" style={{ flex: 1, padding: "15px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" }}>Submit Rating</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Simple Admin Panel Component
const SimpleAdminPanel = ({ onClose }) => {
  const [pendingServices, setPendingServices] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    setPendingServices([
      { id: 1, service_name: 'Premium Cleaning Service', category: 'Cleaning', provider_email: 'newprovider@example.com', price: 60, location: 'Mumbai', description: 'Professional deep cleaning service' },
      { id: 2, service_name: 'Advanced Electrical Repairs', category: 'Electrical', provider_email: 'electrician@example.com', price: 90, location: 'Delhi', description: 'Complex electrical installations' }
    ]);
  }, []);

  const approveService = (serviceId) => {
    setPendingServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const rejectService = (serviceId) => {
    setPendingServices(prev => prev.filter(s => s.id !== serviceId));
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 1000, padding: '20px', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #ecf0f1', paddingBottom: '20px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Admin Dashboard</h1>
        <button onClick={onClose} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Close Admin</button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button style={{ padding: '12px 24px', background: activeTab === 'pending' ? '#3498db' : '#f8f9fa', color: activeTab === 'pending' ? 'white' : 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }} onClick={() => setActiveTab('pending')}>
          Pending Listings ({pendingServices.length})
        </button>
        <button style={{ padding: '12px 24px', background: activeTab === 'analytics' ? '#3498db' : '#f8f9fa', color: activeTab === 'analytics' ? 'white' : 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }} onClick={() => setActiveTab('analytics')}>
          Analytics
        </button>
      </div>

      <div>
        {activeTab === 'pending' && (
          <div>
            <h2>Pending Service Approvals</h2>
            {pendingServices.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '40px' }}>No pending services for review</p>
            ) : (
              pendingServices.map(service => (
                <div key={service.id} style={{ background: 'white', padding: '20px', marginBottom: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderLeft: '4px solid #e74c3c' }}>
                  <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>{service.service_name}</h3>
                  <p><strong>Category:</strong> {service.category}</p>
                  <p><strong>Provider:</strong> {service.provider_email}</p>
                  <p><strong>Price:</strong> ₹{service.price}</p>
                  <p><strong>Location:</strong> {service.location}</p>
                  <p><strong>Description:</strong> {service.description}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button style={{ background: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => approveService(service.id)}>✅ Approve</button>
                    <button style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => rejectService(service.id)}>❌ Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2>Platform Analytics</h2>





 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📊 Top Categories</h3>
                <div>
                  {[
                    { category: 'Cleaning', bookings: 45 },
                    { category: 'Plumbing', bookings: 38 },
                    { category: 'Electrical', bookings: 32 },
                    { category: 'Tutoring', bookings: 28 },
                    { category: 'Painting', bookings: 25 }
                  ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ecf0f1' }}>
                      <span style={{ fontWeight: '500', color: '#2c3e50' }}>{item.category}</span><span style={{ color: '#3498db', fontWeight: 'bold' }}>{item.bookings} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>🔥 Top Services</h3>
                <div>
                  {[
                    { service_name: 'Emergency Plumbing', bookings: 35 },
                    { service_name: 'Home Cleaning', bookings: 30 },
                    { service_name: 'Math Tutoring', bookings: 25 },
                    { service_name: 'Electrical Repairs', bookings: 22 },
                    { service_name: 'Gardening Service', bookings: 18 }
                  ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ecf0f1' }}> <span style={{ fontWeight: '500', color: '#2c3e50' }}>{item.service_name}</span>
                      <span style={{ color: '#3498db', fontWeight: 'bold' }}>{item.bookings} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#7f8c8d', marginBottom: '10px', fontSize: '14px' }}>Total Services</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>12</p>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#7f8c8d', marginBottom: '10px', fontSize: '14px' }}>Pending Approval</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>{pendingServices.length}</p>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#7f8c8d', marginBottom: '10px', fontSize: '14px' }}>Total Bookings</h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50', margin: 0 }}>156</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


            
            

const CustomerDashboard = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ search: "", category: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const defaultCategories = [
    { category: 'Plumbing' }, { category: 'Electrical' }, { category: 'Cleaning' }, { category: 'Carpentry' }, { category: 'Painting' }, { category: 'Gardening' }, { category: 'Tutoring' }, { category: 'Beauty' }, { category: 'Fitness' }, { category: 'Moving' }
  ];

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async (filterParams = {}) => {
    setLoading(true); setError("");
    try {
      const queryParams = new URLSearchParams(filterParams).toString();
      const res = await fetch(`http://localhost:5000/services?${queryParams}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setServices(data);
    } catch (err) { console.error(err); setError(`Failed to load services: ${err.message}`); }
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/service_categories");
      const data = await res.json();
      if (Array.isArray(data)) { setCategories(data); }
      else if (data && typeof data === 'object') { setCategories(Object.values(data)); }
      else { setCategories(defaultCategories); }
    } catch (err) { console.error(err); setCategories(defaultCategories); }
  };

  const handleFilterChange = (e) => { const { name, value } = e.target; setFilters(prev => ({ ...prev, [name]: value })); };
  const handleSearch = (e) => { e.preventDefault(); fetchServices(filters); };
  const clearFilters = () => { setFilters({ search: "", category: "", location: "" }); fetchServices(); };
  const displayCategories = Array.isArray(categories) && categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="customer-dashboard">
      <button onClick={() => setShowAdminPanel(true)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', zIndex: 100 }}>Admin Panel</button>

      <h1>Find Local Services</h1>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search Services</label>
              <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="What service do you need?" />
            </div>
            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {displayCategories.map((cat, index) => (
                  <option key={cat.category || index} value={cat.category || cat}>{cat.category || cat}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Location</label>
              <input type="text" name="location" value={filters.location} onChange={handleFilterChange} placeholder="City or ZIP code" />
            </div>
          </div>

          <div className="filter-actions">
            <button type="submit" className="btn-search">Search Services</button>
            <button type="button" onClick={clearFilters} className="btn-clear">Clear Filters</button>
          </div>
        </form>
      </div>

      <div className="services-section">
        {error && <div className="error-message">{error}</div>}
        {loading ? <div className="loading">Loading services...</div> :
          services.length === 0 ? <div className="no-services"><p>No services found. Try adjusting your filters.</p></div> :
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <h3 className="service-title">{service.service_name}</h3>
                <p className="description">{service.description}</p>

                <div className="service-details">
                  <div className="price">₹{service.price}</div>
                  <div className={`availability ${service.availability ? service.availability.toLowerCase() : 'available'}`}>{service.availability || 'Available'}</div>
                </div>

                <div className="location-info">
                  <p><strong>Location:</strong> {service.location}</p>
                  <p><strong>City:</strong> {service.city}</p>
                  <p><strong>ZIP:</strong> {service.zip_code}</p>
                  <p><strong>Provider:</strong> {service.provider_email}</p>
                </div>

                <div className="service-actions">
                  <button className="btn-book" onClick={() => { setSelectedService(service); setShowBookingModal(true); }} disabled={service.availability !== "Available"}>Book Now</button>
                  <button className="btn-contact">Contact</button>
                  <button className="btn-rate" onClick={() => { setSelectedService(service); setShowRatingModal(true); }}>Rate</button>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {showAdminPanel && <SimpleAdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showBookingModal && selectedService && <BookingForm service={selectedService} onClose={() => setShowBookingModal(false)} />}
      {showRatingModal && selectedService && <RatingForm service={selectedService} onClose={() => setShowRatingModal(false)} />}
    </div>
  );
};

export default CustomerDashboard;
