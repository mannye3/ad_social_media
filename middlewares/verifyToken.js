const jwt = require('jsonwebtoken');
const { CustomError } = require('./error');


const authenticateToken = (req, res, next) => {
    console.log("Headers:", req.headers); // Debug log

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("Token:", token); // Debug log

    if (!token) {
        return next(new CustomError('No token provided', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Token verification error:", err); // Debug log
            return next(new CustomError('Invalid token', 403));
        }

        req.user = user;
        console.log("Authenticated user:", req.user); // Debug log
        next();
    });
};

module.exports = { authenticateToken };