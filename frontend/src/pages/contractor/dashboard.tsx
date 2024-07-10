import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const MonEspaceContractor = () => {
    const [contractorInfo, setContractorInfo] = useState<any>(null);
    const [pastServices, setPastServices] = useState<any[]>([]);
    const [currentServices, setCurrentServices] = useState<any[]>([]);
    const [upcomingServices, setUpcomingServices] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchContractorInfo = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setContractorInfo(data);
                } else {
                    console.error('Failed to fetch contractor info');
                }
            } catch (error) {
                console.error('Error fetching contractor info:', error);
            }
        };

        const fetchServices = async (type: string) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services?status=${type}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (type === 'past') setPastServices(data);
                    else if (type === 'current') setCurrentServices(data);
                    else if (type === 'upcoming') setUpcomingServices(data);
                } else {
                    console.error(`Failed to fetch ${type} services`);
                }
            } catch (error) {
                console.error(`Error fetching ${type} services:`, error);
            }
        };

        fetchContractorInfo();
        fetchServices('past');
        fetchServices('current');
        fetchServices('upcoming');
    }, [router]);

    if (!contractorInfo) {
        return <p>Chargement...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold text-gray-700">Mon Espace Prestataire</h1>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Informations Personnelles</h2>
                <p>Nom: {contractorInfo.contact_first_name} {contractorInfo.contact_last_name}</p>
                <p>Email: {contractorInfo.email}</p>
                <p>SIRET: {contractorInfo.siret}</p>
                <p>Nom de l'entreprise: {contractorInfo.company_name}</p>
                <p>Adresse: {contractorInfo.address}</p>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Services Passés</h2>
                <ul>
                    {pastServices.map((service) => (
                        <li key={service.id} className="border p-4 rounded mt-2">
                            <p>Service: {service.name}</p>
                            <p>Description: {service.description}</p>
                            <p>Tarif: {service.tarif} €</p>
                            <p>Date de prestation: {new Date(service.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Services en Cours</h2>
                <ul>
                    {currentServices.map((service) => (
                        <li key={service.id} className="border p-4 rounded mt-2">
                            <p>Service: {service.name}</p>
                            <p>Description: {service.description}</p>
                            <p>Tarif: {service.tarif} €</p>
                            <p>Date de prestation: {new Date(service.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4">
                <h2 className="text-xl font-semibold">Services à Venir</h2>
                <ul>
                    {upcomingServices.map((service) => (
                        <li key={service.id} className="border p-4 rounded mt-2">
                            <p>Service: {service.name}</p>
                            <p>Description: {service.description}</p>
                            <p>Tarif: {service.tarif} €</p>
                            <p>Date de prestation: {new Date(service.date).toLocaleDateString()}</p>
                            <p>Adresse du logement: {service.location}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MonEspaceContractor;
