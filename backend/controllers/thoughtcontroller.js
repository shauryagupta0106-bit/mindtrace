const Thought = require("../models/Thought")

exports.createThought = async (req, res) => {
  try {
    const thought = await Thought.create(req.body)
    res.json(thought)
  } catch (error) {
    res.status(500).json({ message: "Error creating thought" })
  }
}

exports.getThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find()
    res.json(thoughts)
  } catch (error) {
    res.status(500).json({ message: "Error fetching thoughts" })
  }
}