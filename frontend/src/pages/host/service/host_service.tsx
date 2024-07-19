import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import HostNavMenu from '../../../components/HostNavMenu';

interface ServiceType {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Property {
  id: number;
  title: string;
}

const HostService = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServicesAndProperties = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      try {
        const [serviceResponse, propertyResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/services`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        const serviceData = await serviceResponse.json();
        const propertyData = await propertyResponse.json();

        setServiceTypes(serviceData);
        setProperties(propertyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchServicesAndProperties();
  }, [router]);

  const handleBuyService = async (serviceTypeId: number) => {
    const token = Cookie.get('token');
    if (!token || !selectedProperty) {
      alert('Veuillez sélectionner une propriété.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/buy-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceTypeId,
          propertyId: selectedProperty,
        }),
      });

      if (response.ok) {
        alert('Service acheté avec succès!');
      } else {
        const errorData = await response.json();
        alert('Échec de l\'achat du service : ' + errorData.message);
      }
    } catch (error) {
      console.error('Error buying service:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <HostNavMenu />
      <div className="w-3/4 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Services Ponctuels Disponibles</h1>
        <div className="mb-4">
          <label htmlFor="propertySelect" className="block text-gray-700">Sélectionnez une propriété:</label>
          <select
            id="propertySelect"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={selectedProperty || ''}
            onChange={(e) => setSelectedProperty(Number(e.target.value))}
          >
            <option value="" disabled>Choisir une propriété</option>
            {properties.map((property) => (
              <option key={property.id} value={property.id}>{property.title}</option>
            ))}
          </select>
        </div>
        <ul>
          {serviceTypes.map(serviceType => (
            <li key={serviceType.id} className="border p-4 rounded bg-white shadow-md mb-4">
              <p><strong>Nom:</strong> {serviceType.name}</p>
              <p><strong>Description:</strong> {serviceType.description}</p>
              <p><strong>Prix:</strong> {serviceType.price} €</p>
              <button
                onClick={() => handleBuyService(serviceType.id)}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2"
              >
                Acheter ce service
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HostService;
