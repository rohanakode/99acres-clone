import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    image: "",
    description: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/properties/${id}`
        );
        setForm({
          title: res.data.title || "",
          price: res.data.price || "",
          location: res.data.location || "",
          image: res.data.image || "",
          description: res.data.description || "",
        });
      } catch (err) {
        console.error("Error fetching property:", err);
        alert("Failed to load property");
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "rohanakode");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dv3dhqisl/image/upload",
        formData
      );
      setForm({ ...form, image: res.data.secure_url });
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/properties/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Property updated successfully!");
      navigate("/my-listings");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update property");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <label style={{ display: "block", marginBottom: "5px" }}>
          Upload New Image
        </label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImageUpload}
          style={{ marginBottom: "10px" }}
        />
        {uploading && <p className="text-info">Uploading image...</p>}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="img-fluid mb-2"
            style={{ maxHeight: "200px", display: "block" }}
          />
        )}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit">Update Property</button>
      </form>
    </div>
  );
};

export default EditProperty;
