const User = require("../models/user")
const bcrypt = require("bcrypt")

exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.json(user)

    } catch (error) {

        res.status(500).json({ message: "Error registering user" })

    }
}