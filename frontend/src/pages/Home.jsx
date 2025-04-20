import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchProperties();
    setSearchLocation("");
  }, [location.pathname]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/api/properties`
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const handleSearch = async () => {
    let url = `${import.meta.env.VITE_API_BASE}/api/properties?`;
    if (searchLocation) url += `location=${searchLocation}`;

    try {
      const res = await axios.get(url);
      setProperties(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Properties</h2>

      <div className="input-group mb-4" style={{ maxWidth: "400px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
        <button className="btn btn-outline-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="row">
        {properties.map((property) => (
          <div key={property._id} className="col-md-4 mb-4">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
