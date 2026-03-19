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
        res.cookie("token", token, {
      httpOnly: true,
      secure: true,       // required for HTTPS (Vercel + Render)
      sameSite: "None"    // VERY IMPORTANT for cross-origin
    });

    // send response
    res.status(200).json({
      message: "Login successful",
      user
    });

    } catch (error) {

        res.status(500).json({ message: "Error registering user" })

    }
}