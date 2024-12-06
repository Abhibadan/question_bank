const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

class UserAuth {
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
    static async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const decoded =await UserAuth.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authentication' });
        }
    }     
}

module.exports = UserAuth;