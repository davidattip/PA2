// pages/contractor/register.tsx

//URL de la requête modifiée :
// Pointe désormais vers votre route backend /api/companies/search pour profiter du traitement côté serveur, notamment la gestion des jetons.
// Gestion de l'état de chargement et des erreurs :
// Améliore l'expérience utilisateur en fournissant des retours sur l'état de la requête.
// Sécurisation des appels API :
// Les appels API côté client ne contiennent plus de jetons sensibles ou d'autres détails d'authentification.



import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InputGroup from '../../components/InputGroup';
import Cookie from 'js-cookie';

interface Company {
    siret: string;
    name: string;
}

const Register: React.FC = () => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Fonction pour charger les entreprises depuis le backend
    const fetchCompanies = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/companies/search?term=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch companies');
            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
            setError('Failed to fetch companies');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitStep1 = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStep(1);
        await fetchCompanies();
    };

    const handleSubmitStep2 = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const token = Cookie.get('token');
        const response = await fetch('/api/contractor/setCompany', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ company_siret: company }),
        });

        if (response.ok) {
            router.push('/contractor/dashboard');
        } else {
            alert('Failed to set company.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
                {step === 0 && (
                    <form onSubmit={handleSubmitStep1}>
                        {/* Formulaires pour les informations personnelles */}
                        <InputGroup name="email" label="Adresse Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <InputGroup name="password" label="Mot de Passe *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <InputGroup name="firstName" label="Prénom *" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <InputGroup name="lastName" label="Nom *" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Suivant</button>
                    </form>
                )}
                {step === 1 && (
                    <form onSubmit={handleSubmitStep2}>
                        <InputGroup name="search" label="Recherche d'entreprise" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <button type="button" onClick={fetchCompanies} className="my-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{loading ? 'Loading...' : 'Rechercher'}</button>
                        {error && <p className="text-red-500">{error}</p>}
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Select Your Company (by SIRET)</label>
                        <select
                            id="company"
                            name="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a company</option>
                            {companies.map((comp) => (
                                <option key={comp.siret} value={comp.siret}>
                                    {comp.name} - {comp.siret}
                                </option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Enregistrer
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
