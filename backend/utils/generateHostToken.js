// utils/generateHostToken.js
const jwt = require('jsonwebtoken');

const generateHostToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, user_type: 'host' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = generateHostToken;
