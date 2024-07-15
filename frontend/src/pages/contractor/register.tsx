import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InputGroup from '../../components/InputGroup';

interface Company {
    siret: string;
    name: string;
    address: string;
}

const Register: React.FC = () => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const fetchCompanies = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setError('');
        console.log(`Fetching companies with searchTerm: ${searchTerm}`);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies/search?term=${encodeURIComponent(searchTerm)}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Response status: ${response.status}`);
            const data = await response.json();
            console.log('Companies data received:', data);
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
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSiret = e.target.value;
        setCompany(selectedSiret);
        const selectedCompany = companies.find(comp => comp.siret === selectedSiret);
        if (selectedCompany) {
            setCompanyName(selectedCompany.name);
            setAddress(selectedCompany.address);
        }
    };

    const handleSubmitStep2 = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    contact_first_name: firstName,
                    contact_last_name: lastName,
                    siret: company,
                    company_name: companyName,
                    address
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration Successful', data);
                router.push('/contractor/dashboard');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Registration Error:', error);
            alert('Une erreur s’est produite lors de l’inscription.');
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
                            onChange={handleCompanyChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a company</option>
                            {companies.map((comp) => (
                                <option key={comp.siret} value={comp.siret}>
                                    {comp.name} - {comp.siret} - {comp.address}
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
                <p className="mt-4 text-center">
                    <a href="/contractor/login" className="text-blue-600 hover:underline">Vous avez déjà un compte, cliquez ici ?</a>
                </p>
            </div>
        </div>
    );
};

export default Register;
