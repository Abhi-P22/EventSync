import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.id === 'guest') {
            req.user = { isGuest: true };
        } else {
            req.user = await User.findById(decoded.id).select('-password');
            req.user.isGuest = false;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default protect;


