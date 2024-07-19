import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
}

const EditMyService = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
    const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/services/service-types`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => response.json())
            .then((data: Service[]) => setServices(data))
            .catch(error => console.error('Error fetching service types:', error));
    }, [router]);

    const handleSelectService = (id: number) => {
        setSelectedServiceId(id);
    };

    const handleSubmit = () => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        if (selectedServiceId) {
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contractor/services/service-types/select/${selectedServiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ contractorId: selectedServiceId })
            })
                .then(response => {
                    if (response.ok) {
                        setConfirmationVisible(true);
                        setTimeout(() => {
                            setConfirmationVisible(false);
                            router.push('/contractor/dashboard');
                        }, 3000);
                    } else {
                        throw new Error('Failed to select service');
                    }
                })
                .catch(error => console.error('Error selecting service:', error));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Veuillez choisir le type de Service pour lequel vous fournirez la prestation</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {services.map(service => (
                    <div key={service.id}
                         className={`card border p-4 ${selectedServiceId === service.id ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:shadow-md'} transition duration-300 ease-in-out cursor-pointer`}
                         onClick={() => handleSelectService(service.id)}>
                        <h2 className="text-lg font-semibold">{service.name}</h2>
                        <p className="text-gray-600">{service.description}</p>
                        <p className="text-gray-800 font-bold">Prix: {Number(service.price).toFixed(2)}€</p>
                    </div>
                ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600" onClick={handleSubmit}>Enregistrer le choix</button>
            {confirmationVisible && (
                <div className="text-green-500 mt-2">
                    Vous avez choisi: {services.find(service => service.id === selectedServiceId)?.name}
                </div>
            )}
        </div>
    );
};

export default EditMyService;
