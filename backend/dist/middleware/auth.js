import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
export const requireAuth = async (req, res, next) => {
    try {
        let token;
        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
            return;
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fm_access_secret');
        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ success: false, message: 'User no longer exists.' });
            return;
        }
        // Add user to request
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ success: false, message: 'Access token expired.', code: 'TOKEN_EXPIRED' });
            return;
        }
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
    }
    if (req.user.role !== 'admin') {
        res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
        return;
    }
    next();
};
