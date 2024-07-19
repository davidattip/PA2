import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

type Contractor = {
    id: number;
    contact_first_name: string;
    contact_last_name: string;
    email: string;
    company_name: string;
    siret: string;
    address: string;
};

const Id = () => {
    const router = useRouter();
    const { id } = router.query;
    const [contractor, setContractor] = useState<Contractor | null>(null);
    const [initialContractor, setInitialContractor] = useState<Contractor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id && typeof id === 'string') {
            const fetchContractor = async () => {
                try {
                    const token = Cookie.get('token');
                    if (!token) {
                        throw new Error('No token found');
                    }
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/contractors/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to fetch contractor data: ${response.statusText}`);
                    }
                    const data: Contractor = await response.json();
                    setContractor(data);
                    setInitialContractor(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching contractor data:', error);
                    setError('Failed to fetch contractor data.');
                    setLoading(false);
                }
            };
            fetchContractor();
        }
    }, [id]);

    const handleUpdateContractor = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (contractor && initialContractor && typeof id === 'string') {
            const updatedFields: Partial<Contractor> = {};
            (Object.keys(contractor) as (keyof Contractor)[]).forEach(key => {
                if (contractor[key] !== initialContractor[key]) {
                    if (contractor[key] !== undefined) {
                        updatedFields[key] = contractor[key] as any;
                    }
                }
            });

            if (Object.keys(updatedFields).length === 0) {
                console.log('No changes detected.');
                return;
            }

            try {
                const token = Cookie.get('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/contractors/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedFields),
                });
                if (!response.ok) {
                    throw new Error(`Failed to update contractor data: ${response.statusText}`);
                }
                router.push('/admin_contractor');
            } catch (error) {
                console.error('Error updating contractor data:', error);
                setError('Failed to update contractor data.');
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContractor(prevState => prevState ? { ...prevState, [name]: value } : null);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-500">{error}</div>;
    }

    if (!contractor) {
        return <div className="flex justify-center items-center min-h-screen bg-gray-100">Contractor not found</div>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Edit Contractor</h1>
                <form onSubmit={handleUpdateContractor} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name:</label>
                        <input
                            type="text"
                            name="contact_first_name"
                            value={contractor.contact_first_name}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name:</label>
                        <input
                            type="text"
                            name="contact_last_name"
                            value={contractor.contact_last_name}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={contractor.email}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name:</label>
                        <input
                            type="text"
                            name="company_name"
                            value={contractor.company_name}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SIRET:</label>
                        <input
                            type="text"
                            name="siret"
                            value={contractor.siret}
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={contractor.address}
                            onChange={handleChange}
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                    {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default Id;
