import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/properties/${id}`
        );
        setProperty(res.data);
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUserId(decoded.userId);
      } catch (e) {
        console.error("Token decode failed", e);
      }
    }

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    console.log("Sending token:", localStorage.getItem("token"));

    try {
      const res = await axios.delete(
        `http://localhost:5000/api/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success === false) {
        alert(res.data.message);
      } else {
        alert("Property deleted successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property");
    }
  };

  if (!property) return <p>Loading property details...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/")}
        className="btn btn-outline-primary mb-3"
      >
        ← Back to Home
      </button>
      <div className="row">
        <div className="col-md-6">
          <img
            src={property.image}
            alt={property.title}
            className="img-fluid rounded"
            style={{ maxHeight: "400px" }}
          />
        </div>
        <div className="col-md-6">
          <h3>{property.title}</h3>
          <p>
            <strong>Location:</strong> {property.location}
          </p>
          <p>
            <strong>Price:</strong> ₹{property.price.toLocaleString()}
          </p>
          <p>{property.description}</p>

          {currentUserId === property.userId && (
            <button className="btn btn-danger mt-3" onClick={handleDelete}>
              Delete Property
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
