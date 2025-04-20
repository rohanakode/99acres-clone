const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  image: String,
  description: String,
  postedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
});

module.exports = mongoose.model("Property", propertySchema);
