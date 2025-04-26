const { verifyToken } = require("../services/auth");

function checkForAuthCookie(cookieName) {
    return (req, res, next) => {
        const cookieValue = req.cookies[cookieName];
        // If cookie is missing, skip verification and proceed
        if (!cookieValue) {
            return next();
        }
        try {
            const payload = verifyToken(cookieValue);
            // Attach the decoded token payload to the request object for further use
            req.user = payload;
            
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        next();
    };
}

module.exports = {checkForAuthCookie};
