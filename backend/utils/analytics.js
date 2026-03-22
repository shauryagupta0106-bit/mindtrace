const Thought = require("../models/Thought");


// 📊 Get Analytics for a User
const getAnalytics = async (userId) => {
  try {
    const thoughts = await Thought.find({ userId });

    const totalThoughts = thoughts.length;

    // 🧠 Emotion Frequency
    const emotionCount = {};
    thoughts.forEach((t) => {
      emotionCount[t.emotion] = (emotionCount[t.emotion] || 0) + 1;
    });

    // ❤️ Most Common Emotion
    let mostCommonEmotion = null;
    let maxCount = 0;

    for (let emotion in emotionCount) {
      if (emotionCount[emotion] > maxCount) {
        maxCount = emotionCount[emotion];
        mostCommonEmotion = emotion;
      }
    }

    // ⚡ Decision Success Rate
    let success = 0;
    let totalResults = 0;

    thoughts.forEach((t) => {
      if (t.actualOutcome && t.resultType) {
        totalResults++;
        if (t.resultType === "Success") success++;
      }
    });

    const successRate =
      totalResults === 0 ? 0 : ((success / totalResults) * 100).toFixed(2);

    // 🏷 Tag Frequency
    const tagCount = {};
    thoughts.forEach((t) => {
      t.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });

    // 📈 Monthly Trend
    const monthlyTrend = {};

    thoughts.forEach((t) => {
      const month = new Date(t.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
    });

    return {
      totalThoughts,
      mostCommonEmotion,
      emotionCount,
      successRate,
      tagCount,
      monthlyTrend,
    };
  } catch (error) {
    console.error("Analytics Error:", error.message);
    throw error;
  }
};

module.exports = { getAnalytics };