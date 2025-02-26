import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
// Signup
export const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const user = new User({ username, email, password, role });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");
        const isMatch = await user.comparePassword(password);
        if (!isMatch) throw new Error("Invalid credentials");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token, role: user.role, username: user.username });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};