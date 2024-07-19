// pages/host/subscription/addSubscription.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import HostNavMenu from '../../../components/HostNavMenu';

interface SubscriptionType {
  id: number;
  name: string;
  description: string;
  price: number;
  targetUser: string;
}

interface Property {
  id: number;
  title: string;
}

const AddSubscription = () => {
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active'); // Default status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      try {
        const [subscriptionResponse, propertyResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscription-types`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/properties`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);

        const subscriptionData = await subscriptionResponse.json();
        const propertyData = await propertyResponse.json();

        setSubscriptionTypes(subscriptionData);
        setProperties(propertyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    if (!selectedType || !selectedProperty) {
      setError('Veuillez sélectionner un type d\'abonnement et une propriété.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ startDate, endDate, status, subscriptionTypeId: selectedType, propertyId: selectedProperty })
      });

      if (response.ok) {
        router.push('/host/subscription/hostSubscription');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create subscription');
      }
    } catch (error) {
      setError('An error occurred while creating the subscription');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <HostNavMenu />
      <div className="w-3/4 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Souscrire à un Abonnement</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Type d'Abonnement</label>
            <select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="" disabled>Sélectionnez un type d'abonnement</option>
              {subscriptionTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name} - {type.price} €</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Propriété</label>
            <select
              value={selectedProperty || ''}
              onChange={(e) => setSelectedProperty(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="" disabled>Sélectionnez une propriété</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date de Début</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date de Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Souscrire
            </button>
            <button
              type="button"
              onClick={() => router.push('/host/subscription/hostSubscription')}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscription;
