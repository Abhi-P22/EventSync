import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id, isGuest = false) => {
    return jwt.sign({ id, isGuest }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 🔥 Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔥 Guest Login (No Database)
export const guestLogin = async (req, res) => {
    res.json({
        _id: 'guest',
        name: 'Guest User',
        email: 'guest@example.com',
        token: generateToken('guest', true),
    });
};
