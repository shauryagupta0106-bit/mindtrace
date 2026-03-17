const express = require("express")
const router = express.Router()

const {
    createThought,
    getThoughts
} = require("../controllers/thoughtcontroller")

router.post("/", createThought)

router.get("/", getThoughts)

module.exports = router