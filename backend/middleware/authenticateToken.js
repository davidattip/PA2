const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.error(`Auth Error: Invalid token for request to ${req.path}`);
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        console.error(`Auth Error: No token provided for request to ${req.path}`);
        res.sendStatus(401);
    }
};
module.exports = { authenticateJWT };
