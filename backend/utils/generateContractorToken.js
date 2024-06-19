// utils/generateContractorToken.js
const jwt = require('jsonwebtoken');

const generateContractorToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email, user_type: 'contractor' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    );
};

module.exports = generateContractorToken;
