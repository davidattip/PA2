const fetch = require('node-fetch');
const { ClientCredentials } = require('simple-oauth2');

const config = {
    client: {
        id: 'zvBZEtUwtveGAun6AUxqqvgt2bka', // Remplacez par votre consumer key
        secret: 'I01jgWhfyDlPP7pF2idm3lqs2Bca' // Remplacez par votre consumer secret
    },
    auth: {
        tokenHost: 'https://api.insee.fr',
        tokenPath: '/token' // !!!!!!!!!!!!Ajoutez le chemin du token sinon ça ne marche pas
    }
};

const client = new ClientCredentials(config);

async function getAccessToken() {
    try {
        const accessToken = await client.getToken({
            scope: '' // Remplacez par le scope réel si nécessaire, sinon laissez vide
        });
        console.log('Access Token obtenu:', accessToken.token.access_token);
        return accessToken.token.access_token;
    } catch (error) {
        console.error('Erreur de jeton d\'accès:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        }
        return null;
    }
}

async function searchCompanies(searchTerm) {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        console.error('Pas de jeton d\'accès disponible');
        return [];
    }

    try {
        const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3.11/siret?q=denominationUniteLegale:${encodeURIComponent(searchTerm)}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Données reçues de l\'API INSEE:', data);
        return data.etablissements || [];
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API INSEE:', error);
        return [];
    }
}

module.exports = {
    searchCompanies
};
