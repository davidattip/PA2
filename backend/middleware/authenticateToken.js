const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // il extrait le token en séparant l'en-tête par l'espace (' ') et en prenant la deuxième partie

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {  // Utilise jwt.verify pour vérifier le token avec le secret
            if (err) { //Si le token est valide, il décode le token et attache les informations utilisateur (user) à l'objet req
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
