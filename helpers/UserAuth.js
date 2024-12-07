
const jwt = require('jsonwebtoken');
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

    static generateToken(userId) {
        return jwt.sign(
            { id: userId},
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static async verifyToken(token) {
        try {
            const decoded= jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }else{
                return user;
            }
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    static async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'Authentication required' });
            }
            const user =await UserAuth.verifyToken(token);
            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid authentication' });
        }
    }        
}

module.exports = UserAuth;