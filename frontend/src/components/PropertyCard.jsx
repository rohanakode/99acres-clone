import React from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  return (
    <Link
      to={`/property/${property._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="card shadow-sm mb-4 border hover-effect"
        style={{
          width: "18rem",
          transition: "transform 0.2s, box-shadow 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <img
          src={property.image || "https://via.placeholder.com/250x150"}
          className="card-img-top"
          alt={property.title}
          style={{ height: "180px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title text-capitalize fw-semibold">
            {property.title}
          </h5>
          <p className="card-text mb-1">
            <strong>Location:</strong> {property.location}
          </p>
          <p className="card-text mb-2">
            <strong>Price:</strong> ₹{property.price.toLocaleString()}
          </p>
          <p className="card-text text-muted small text-truncate">
            {property.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
