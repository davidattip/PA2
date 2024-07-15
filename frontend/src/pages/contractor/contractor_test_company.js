// pages/contractor_test_company.js
import { useState } from 'react';

const ContractorTestCompany = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/contractor-test/test-company?searchTerm=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            console.log('Données reçues:', data);
            if (response.ok) {
                setResults(data);
                setError('');
            } else {
                setError(data.message || 'Erreur lors de la recherche des entreprises.');
            }
        } catch (err) {
            console.error('Erreur attrapée:', err);
            setError('Erreur de connexion avec le serveur.');
        }
    };

    return (
        <div>
            <h1>Tester l API INSEE</h1>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nom de l'entreprise"
            />
            <button onClick={handleSearch}>Rechercher</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {results.map((company) => (
                    <li key={company.siret}>
                        {company.uniteLegale.denominationUniteLegale} - {company.siret}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContractorTestCompany;
