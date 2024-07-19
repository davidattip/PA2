import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaEdit } from 'react-icons/fa';

interface Contractor {
    id: number;
    contact_first_name: string;
    contact_last_name: string;
    email: string;
    user_type: string;
    company_name: string;
    siret: string;
    address: string;
}

const ViewContractor: React.FC = () => {
    const [contractor, setContractor] = useState<Contractor | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchContractor = async () => {
            try {
                const token = Cookie.get('token');
                if (!token) {
                    console.error('Token is not available');
                    return;
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/contractors/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setContractor(data);
            } catch (error) {
                console.error('Failed to fetch contractor:', error);
            }
        };

        if (id) {
            fetchContractor();
        }
    }, [id]);

    if (!contractor) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold text-gray-700">Détails du Contractor</h1>
            <div className="mt-4">
                <p><strong>ID:</strong> {contractor.id}</p>
                <p><strong>Prénom:</strong> {contractor.contact_first_name}</p>
                <p><strong>Nom:</strong> {contractor.contact_last_name}</p>
                <p><strong>Email:</strong> {contractor.email}</p>
                <p><strong>Entreprise:</strong> {contractor.company_name}</p>
                <p><strong>SIRET:</strong> {contractor.siret}</p>
                <p><strong>Adresse:</strong> {contractor.address}</p>
                <div className="flex space-x-2 mt-4">
                    <Link href={`/adminContractor/edit-contractor/${contractor.id}`} passHref>
                        <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                            <FaEdit /> Modifier
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ViewContractor;
