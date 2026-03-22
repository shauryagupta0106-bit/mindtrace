const Thought = require("../models/Thought");


// 🟢 Create Thought
const createThought = async (req, res) => {
  try {
    const {
      title,
      thought,
      emotion,
      decision,
      expectedOutcome,
      tags,
      privacy,
    } = req.body;

    const newThought = await Thought.create({
      title,
      thought,
      emotion,
      decision,
      expectedOutcome,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      privacy,
      evidenceFile: req.file ? req.file.path : "",
      userId: req.user._id,
    });

    res.status(201).json(newThought);
  } catch (error) {
    console.error("Create Thought Error:", error.message);
    res.status(500).json({ message: "Error creating thought" });
  }
};


// 🔵 Get All Thoughts (for logged-in user)
const getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(thoughts);
  } catch (error) {
    console.error("Get Thoughts Error:", error.message);
    res.status(500).json({ message: "Error fetching thoughts" });
  }
};


// 🟡 Get Single Thought
const getThoughtById = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Check ownership or public
    if (
      thought.userId.toString() !== req.user._id.toString() &&
      thought.privacy !== "public"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(thought);
  } catch (error) {
    console.error("Get Thought Error:", error.message);
    res.status(500).json({ message: "Error fetching thought" });
  }
};


// 🟠 Update Thought
const updateThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Only owner can update
    if (thought.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Thought.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        evidenceFile: req.file ? req.file.path : thought.evidenceFile,
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Thought Error:", error.message);
    res.status(500).json({ message: "Error updating thought" });
  }
};


// 🔴 Delete Thought
const deleteThought = async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Only owner can delete
    if (thought.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await thought.deleteOne();

    res.status(200).json({ message: "Thought deleted successfully" });
  } catch (error) {
    console.error("Delete Thought Error:", error.message);
    res.status(500).json({ message: "Error deleting thought" });
  }
};


// 🟣 Update Outcome
const updateOutcome = async (req, res) => {
  try {
    const { actualOutcome, resultType } = req.body;

    const thought = await Thought.findById(req.params.id);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    if (thought.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    thought.actualOutcome = actualOutcome || thought.actualOutcome;
    thought.resultType = resultType || thought.resultType;

    await thought.save();

    res.status(200).json(thought);
  } catch (error) {
    console.error("Update Outcome Error:", error.message);
    res.status(500).json({ message: "Error updating outcome" });
  }
};


// 🔍 Search Thoughts
const searchThoughts = async (req, res) => {
  try {
    const query = req.query.q;

    const thoughts = await Thought.find({
      userId: req.user._id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { emotion: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(thoughts);
  } catch (error) {
    console.error("Search Error:", error.message);
    res.status(500).json({ message: "Error searching thoughts" });
  }
};


// 🏷 Filter by Tag
const getThoughtsByTag = async (req, res) => {
  try {
    const tag = req.params.tag;

    const thoughts = await Thought.find({
      userId: req.user._id,
      tags: tag,
    });

    res.status(200).json(thoughts);
  } catch (error) {
    console.error("Tag Filter Error:", error.message);
    res.status(500).json({ message: "Error filtering by tag" });
  }
};


module.exports = {
  createThought,
  getThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  updateOutcome,
  searchThoughts,
  getThoughtsByTag,
};