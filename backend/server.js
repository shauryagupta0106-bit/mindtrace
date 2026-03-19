const express = require("express")
const cors = require("cors")
const session = require("express-session")
const dotenv = require("dotenv")

const connectDB = require("./config/db")

const authRoutes = require("./routes/authroutes")
const thoughtRoutes = require("./routes/thoughtroutes")

dotenv.config()

const app = express()

connectDB()

app.use(express.json())

app.use(cors({
  origin: "https://mindtrace-khaki.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(session({
secret:process.env.SESSION_SECRET,
resave:false,
saveUninitialized:false,
cookie:{
secure:false,
httpOnly:true
}
}))

app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
  res.send("MindTrace API Running 🚀")
})

app.use("/api/auth",authRoutes)
app.use("/api/thoughts",thoughtRoutes)

app.listen(process.env.PORT,()=>{
console.log("Server running on port",process.env.PORT)
})