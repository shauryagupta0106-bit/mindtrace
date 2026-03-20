const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const authRoutes = require('./routes/authRoutes');
const thoughtsRoutes = require('./routes/thoughtsRoutes');
const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [
    "https://mindtrace-khaki.vercel.app", // ✅ your current frontend
    "http://localhost:5173" // optional for local testing
  ],
  credentials: true
}))

// routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/thoughts", require("./routes/thoughtsRoutes"))

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err))

// start server
app.listen(5000, ()=> console.log("Server running on port 5000"))