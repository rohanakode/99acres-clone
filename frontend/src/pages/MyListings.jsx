import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const MyListings = () => {
  const [myProperties, setMyProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyListings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to view your listings");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/properties/mine",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyProperties(res.data);
      } catch (err) {
        console.error("Error fetching your listings:", err);
        alert("Failed to fetch your listings.");
      }
    };

    fetchMyListings();
  }, [navigate]);

  const deleteProperty = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyProperties((prev) => prev.filter((prop) => prop._id !== id));
      alert("Property deleted successfully!");
    } catch (err) {
      console.error(" Delete failed:", err.response?.data || err.message);
      alert("Failed to delete property");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Listings</h2>
      {myProperties.length === 0 ? (
        <p>You haven't posted any properties yet.</p>
      ) : (
        <div className="row">
          {myProperties.map((property) => (
            <div className="col-md-4 mb-4" key={property._id}>
              <div className="card h-100">
                <img
                  src={property.image || "https://via.placeholder.com/250x150"}
                  className="card-img-top"
                  alt={property.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{property.title}</h5>
                  <p className="card-text">
                    <strong>Location:</strong> {property.location}
                    <br />
                    <strong>Price:</strong> ₹{property.price.toLocaleString()}
                  </p>
                  <p className="text-muted small">{property.description}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <Link
                    to={`/edit/${property._id}`}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteProperty(property._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
