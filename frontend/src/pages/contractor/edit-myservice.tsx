import React, { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';

const EditMyService = () => {
    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Fetch ServiceTypes
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/service-types`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => response.json())
            .then(data => setServices(data))
            .catch(error => console.error('Error fetching service types:', error));
    }, [router]);

    const handleSelectService = (id) => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Enregistrer le choix
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/service-types/select/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ contractorId: id })
        })
            .then(response => {
                if (response.ok) {
                    setSelectedServiceId(id);
                } else {
                    throw new Error('Failed to select service');
                }
            })
            .catch(error => console.error('Error selecting service:', error));
    };

    return (
        <div className="container">
            {services.map(service => (
                    <div key={service.id} className={`card ${selectedServiceId === service.id ? 'selected' : ''}`} onClick={() => handleSelectService(service.id)}>
    <h2>{service.name}</h2>
    <p>{service.description}</p>
    <p>Prix: {service.price.toFixed(2)}€</p>
    </div>
))}
    </div>
);
};

export default EditMyService;
