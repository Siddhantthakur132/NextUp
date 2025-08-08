const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "maheshsecret";

module.exports.authenticateUser = (req, res, next) => {
  try {
    console.log("--- Middleware: Authenticate User ---"); // Log start
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Middleware Error: No token provided.");
      return res.status(401).json({ message: "Authentication failed: No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Log what's inside the decoded token
    console.log("Middleware: Decoded token payload:", decoded);

    req.user = { userId: decoded.id };
    
    // Log the user object we created
    console.log("Middleware: Attached req.user object:", req.user);

    next();
  } catch (err) {
    console.error("Middleware Error: Invalid token or verification failed.", err.message);
    return res.status(401).json({ message: "Authentication failed: Invalid token." });
  }
};