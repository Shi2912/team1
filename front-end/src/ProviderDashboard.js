import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProviderDashboard.css";

const ProviderDashboard = () => {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const navigate = useNavigate();

  const providerId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    service_name: "",
    description: "",
    price: "",
    location: "",
    city: "",
    zip_code: "",
    availability: "Available",
    category: ""
  });

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const res = await fetch(`http://localhost:5000/my-services/${providerId}`);
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingListing
        ? `http://localhost:5000/services/${editingListing.id}`
        : "http://localhost:5000/services";

      const method = editingListing ? "PUT" : "POST";

      const bodyData = editingListing
        ? { ...formData }
        : { ...formData, provider_id: parseInt(providerId) };

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok) {
        setShowForm(false);
        setEditingListing(null);
        setFormData({
          service_name: "",
          description: "",
          price: "",
          location: "",
          city: "",
          zip_code: "",
          availability: "Available",
          category: ""
        });
        fetchMyListings();
      }
    } catch (err) {
      console.error("Error saving listing:", err);
      alert("Error saving listing");
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      service_name: listing.service_name,
      description: listing.description || "",
      price: listing.price || "",
      location: listing.location || "",
      city: listing.city || "",
      zip_code: listing.zip_code || "",
      availability: listing.availability || "Available",
      category: listing.category || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const res = await fetch(`http://localhost:5000/services/${listingId}`, {
          method: "DELETE"
        });

        const data = await res.json();
        alert(data.message);
        fetchMyListings();
      } catch (err) {
        console.error("Error deleting listing:", err);
        alert("Error deleting listing");
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="provider-dashboard">
      <h1>Service Provider Dashboard</h1>

      <div className="dashboard-header">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Service"}
        </button>
      </div>

      {showForm && (
        <div className="service-form">
          <h2>{editingListing ? "Edit Service" : "Create New Service"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Name *</label>
              <input
                type="text"
                name="service_name"
                value={formData.service_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Availability</label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Vacation">On Vacation</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              {editingListing ? "Update Service" : "Create Service"}
            </button>
          </form>
        </div>
      )}

      <div className="listings-section">
        <h2>My Service Listings</h2>
        {listings.length === 0 ? (
          <p>No services listed yet. Create your first service!</p>
        ) : (
          <div className="listings-grid">
            {listings.map(listing => (
              <div key={listing.id} className="listing-card">
                <h3>{listing.service_name}</h3>
                <p className="category">{listing.category}</p>
                <p className="description">{listing.description}</p>
                <div className="listing-details">
                  {listing.price && <span className="price">${listing.price}</span>}
                  <span className="availability">{listing.availability}</span>
                </div>
                <div className="location">
                  {listing.city && <span>{listing.city}</span>}
                  {listing.zip_code && <span> • {listing.zip_code}</span>}
                </div>
                <div className="listing-actions">
                  <button className="btn-edit" onClick={() => handleEdit(listing)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(listing.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
