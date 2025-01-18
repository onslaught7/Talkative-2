import jwt from 'jsonwebtoken'

export const verifyToken = (request, response, next) => {
    const token = request.cookies.jwt;

    if (!token) {
        return response.status(401).send("Authentication Required");
    }
    
    // If a token is found, verify its authenticity using the secret key defined in environment variables
    jwt.verify(token, process.env.JWT_KEY, async (error, payload) => {
        if (error) return response.status(403).send("Token is not valid");
        request.userId = payload.userId;
        next();
    });
};