const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1] || req.body.token;
  
  console.log("Received token:", token); // Log the received token

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log the decoded token
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error); // Log the error details
    return res.status(403).json({ message: "Invalid or expired token", error: error.message });
  }
};

module.exports = { authenticateToken };