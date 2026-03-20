const mongoose = require("mongoose")

const ThoughtSchema = new mongoose.Schema({
  title: String,
  thought: String,
  emotion: String,
  decision: String,
  expectedOutcome: String,
  actualOutcome: String,
  resultType: {
    type: String,
    enum: ["success", "failed", "neutral"]
  },
  tags: [String],
  evidenceFile: String,
  privacy: {
    type: String,
    enum: ["private", "public"],
    default: "private"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true })

module.exports = mongoose.model("Thought", ThoughtSchema)