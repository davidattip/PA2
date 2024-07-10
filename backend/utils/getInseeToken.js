// utils/getInseeToken.js
const fetch = require('node-fetch');

const getInseeToken = async () => {
    const clientId = 'Jt4xV_AyJc1k9MHsk30SMAfxRI4a';  // Replace with your client ID
    const clientSecret = 'Jt4xV_AyJc1k9MHsk30SMAfxRI4a';  // Replace with your client secret
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await fetch('https://api.insee.fr/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${credentials}`
            },
            body: 'grant_type=client_credentials'
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching INSEE token:', error);
        throw error;
    }
};

module.exports = getInseeToken;
