const mongoose = require("mongoose");

const thoughtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },

    thought: {
      type: String,
      required: [true, "Thought is required"],
    },

    emotion: {
      type: String,
      required: [true, "Emotion is required"],
      enum: [
        "Happy",
        "Sad",
        "Angry",
        "Anxious",
        "Confused",
        "Excited",
        "Neutral",
      ],
    },

    decision: {
      type: String,
      required: [true, "Decision is required"],
    },

    expectedOutcome: {
      type: String,
      required: [true, "Expected outcome is required"],
    },

    actualOutcome: {
      type: String,
      default: "",
    },

    resultType: {
      type: String,
      enum: ["Success", "Failed", "Neutral"],
      default: "Neutral",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    evidenceFile: {
      type: String, // stores file path
      default: "",
    },

    privacy: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Thought", thoughtSchema);