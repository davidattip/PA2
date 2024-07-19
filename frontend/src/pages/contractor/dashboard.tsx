import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

// Définition des types pour TypeScript, si utilisé
interface ContractorInfo {
    contact_first_name: string;
    contact_last_name: string;
    email: string;
    siret: string;
    company_name: string;
    address: string;
}

interface Service {
    id: number;
    name: string;
    description: string;
    tarif: number;
    date: string;
    location?: string;
}

// Utilitaire pour les requêtes API avec gestion du token
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = Cookie.get('token');
    if (!token) {
        throw new Error("No token available");
    }

    const headers = new Headers(options.headers || {});
    headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json');

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${errorText}`);
    }
    return response.json();
}

const MonEspaceContractor = () => {
    const [contractorInfo, setContractorInfo] = useState<ContractorInfo | null>(null);
    const [pastServices, setPastServices] = useState<Service[]>([]);
    const [currentServices, setCurrentServices] = useState<Service[]>([]);
    const [upcomingServices, setUpcomingServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const info = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/me`);
                const past = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/services?status=past`);
                const current = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/services?status=current`);
                const upcoming = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/services?status=upcoming`);

                setContractorInfo(info);
                setPastServices(past);
                setCurrentServices(current);
                setUpcomingServices(upcoming);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch data');

            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (isLoading) {
        return <p>Chargement...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold text-gray-700">Mon Espace Prestataire</h1>
            {contractorInfo && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold">Informations Personnelles</h2>
                    <p>Nom: {contractorInfo.contact_first_name} {contractorInfo.contact_last_name}</p>
                    <p>Email: {contractorInfo.email}</p>
                    <p>SIRET: {contractorInfo.siret}</p>
                    <p>Nom de l'entreprise: {contractorInfo.company_name}</p>
                    <p>Adresse: {contractorInfo.address}</p>
                </div>
            )}
            {/* Répéter pour les services passés, en cours, et à venir */}
        </div>
    );
};

export default MonEspaceContractor;
