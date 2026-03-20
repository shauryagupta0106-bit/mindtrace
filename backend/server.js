const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

// middleware
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: "https://mindtrace-94bp.vercel.app", // your frontend URL
  credentials: true
}))

// routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/thoughts", require("./routes/thoughtRoutes"))

// DB connect
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB Connected"))
.catch(err => console.log(err))

// start server
app.listen(5000, ()=> console.log("Server running on port 5000"))