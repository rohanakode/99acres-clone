const Property = require("../models/Property");

exports.getAllProperties = async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const properties = await Property.find(query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const newProperty = new Property({
      ...req.body,
      user: req.user.userId,
    });

    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error("Error creating property:", err);
    res.status(400).json({ error: "Failed to create property" });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    console.log("Property.user:", property.user.toString());
    console.log("req.user.userId:", req.user.userId);

    if (property.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this property",
      });
    }

    await property.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error while deleting" });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ user: req.user.userId });
    res.status(200).json(properties);
  } catch (err) {
    console.error("Error fetching user listings:", err);
    res.status(500).json({ error: "Failed to fetch your listings" });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(updatedProperty);
  } catch (err) {
    console.error("Error updating property:", err);
    res.status(400).json({ error: "Failed to update property" });
  }
};
