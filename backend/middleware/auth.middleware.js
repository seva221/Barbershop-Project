import jwt from "jsonwebtoken"



// @@@
// READ PLEASE
// the function in terms of routes:
// first going to check the token (authMiddleware), then going to the controller logic
// @@@
const authMiddleware = (req, res, next) => {
    // 1. Get the token from the header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // Extract the actual token string (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token
        // If this fails (expired/fake), it throws an error automatically
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user info to the request
        // Now your controllers can access req.user.id
        req.user = decoded; 

        // 4. Move to the next function (the controller)
        next(); 
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default authMiddleware;