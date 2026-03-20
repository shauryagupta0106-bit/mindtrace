const express = require("express")
const router = express.Router()

const { register, login } = require("../controllers/authController")

// test route
router.get("/", (req, res) => {
  res.send("Auth route working")
})

// actual routes
router.post("/register", register)
router.post("/login", login)

module.exports = router