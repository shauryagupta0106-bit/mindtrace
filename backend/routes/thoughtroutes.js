const express = require("express")
const router = express.Router()

const {
  createThought,
  getThoughts
} = require("../controllers/thoughtController")

router.post("/", createThought)
router.get("/", getThoughts)

module.exports = router