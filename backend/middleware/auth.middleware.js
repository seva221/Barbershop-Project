import jwt from "jsonwebtoken";

// Middleware that verifies a JWT from an HTTP-only cookie
const authMiddleware = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  // Block request if no token exists
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request object
    req.user = decoded;

    // Continue to the next middleware or controller
    next();
  } catch (error) {
    // Block request if token is invalid or expired
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
