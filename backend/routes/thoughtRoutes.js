const express = require("express");
const router = express.Router();

const {
  createThought,
  getThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  updateOutcome,
  searchThoughts,
  getThoughtsByTag,
} = require("../controllers/thoughtController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// 🟢 Create Thought (with file upload)
router.post("/", protect, upload.single("evidence"), createThought);

// 🔵 Get all thoughts
router.get("/", protect, getThoughts);

// 🔍 Search
router.get("/search", protect, searchThoughts);

// 🏷 Filter by tag
router.get("/tag/:tag", protect, getThoughtsByTag);

// 🟡 Get single thought
router.get("/:id", protect, getThoughtById);

// 🟠 Update thought (with optional file)
router.put("/:id", protect, upload.single("evidence"), updateThought);

// 🟣 Update outcome
router.put("/:id/outcome", protect, updateOutcome);

// 🔴 Delete thought
router.delete("/:id", protect, deleteThought);


module.exports = router;