const express = require("express");
const router = express.Router();

const {
  getAllProperties,
  createProperty,
  getPropertyById,
  deleteProperty,
  getMyProperties,
  updateProperty,
} = require("../controllers/propertyController");

const authMiddleware = require("../middleware/authMiddleware"); // ✅ Ensure user is logged in


router.get("/", getAllProperties);
router.get("/mine", authMiddleware, getMyProperties);
router.get("/:id", getPropertyById);
router.post("/", authMiddleware, createProperty);
router.put("/:id", authMiddleware, updateProperty);
router.delete("/:id", authMiddleware, deleteProperty);

module.exports = router;
