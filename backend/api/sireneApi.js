const fetch = require('node-fetch');
const { ClientCredentials } = require('simple-oauth2');

// Configuration pour l'authentification OAuth2
const config = {
    client: {
        id: 'zvBZEtUwtveGAun6AUxqqvgt2bka', //YOUR_CONSUMER_KEY
        secret: 'I01jgWhfyDlPP7pF2idm3lqs2Bca' //YOUR_CONSUMER_SECRET
    },
    auth: {
        tokenHost: 'https://api.insee.fr'
    }
};

// Création du client OAuth2
const client = new ClientCredentials(config);

// Fonction pour obtenir un jeton d'accès
async function getAccessToken() {
    try {
        const accessToken = await client.getToken({
            scope: 'scope_if_needed' // Remplacez 'scope_if_needed' par le scope réel si nécessaire
        });
        return accessToken.token.access_token;
    } catch (error) {
        console.error('Access Token Error', error.message);
        return null;
    }
}

// Fonction pour rechercher des entreprises
async function searchCompanies(searchTerm) {
    const accessToken = await getAccessToken();
    if (!accessToken) return [];

    const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret?q=denominationUniteLegale:${encodeURIComponent(searchTerm)}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    return data.etablissements || [];
}

module.exports = {
    searchCompanies
};
