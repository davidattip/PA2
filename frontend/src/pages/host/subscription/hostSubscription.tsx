import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import HostNavMenu from '../../../components/HostNavMenu';

interface SubscriptionType {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Property {
  id: number;
  title: string;
}

interface Subscription {
  id: number;
  subscriptionType: SubscriptionType;
  property: Property;
  startDate: string;
  endDate: string;
  status: string;
}

const HostSubscription = () => {
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      try {
        const [subscriptionTypeResponse, propertyResponse, subscriptionResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscription-types`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/properties`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscriptions`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        const subscriptionTypeData = await subscriptionTypeResponse.json();
        const propertyData = await propertyResponse.json();
        const subscriptionData = await subscriptionResponse.json();

        console.log('Subscription Types:', subscriptionTypeData);
        console.log('Properties:', propertyData);
        console.log('Subscriptions:', subscriptionData);

        setSubscriptionTypes(subscriptionTypeData);
        setProperties(Array.isArray(propertyData) ? propertyData : []);
        setSubscriptions(Array.isArray(subscriptionData) ? subscriptionData : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSubscribe = async (subscriptionTypeId: number) => {
    const token = Cookie.get('token');
    if (!token || !selectedProperty) {
      alert('Please select a property.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: new Date().toISOString(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
          status: 'active',
          subscriptionTypeId,
          propertyId: selectedProperty,
        }),
      });

      if (response.ok) {
        alert('Subscription successful!');
        const newSubscription = await response.json();
        setSubscriptions([...subscriptions, newSubscription]);
      } else {
        const errorData = await response.json();
        alert('Subscription failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const handleRenew = async (id: number) => {
    const token = Cookie.get('token');
    if (!token) {
      alert('You need to be logged in to renew a subscription.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscriptions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
        }),
      });

      if (response.ok) {
        alert('Subscription renewed successfully!');
        setSubscriptions(subscriptions.map(sub => sub.id === id ? { ...sub, endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() } : sub));
      } else {
        const errorData = await response.json();
        alert('Renewal failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error renewing subscription:', error);
    }
  };

  const handleCancel = async (id: number) => {
    const token = Cookie.get('token');
    if (!token) {
      alert('You need to be logged in to cancel a subscription.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Subscription cancelled successfully!');
        setSubscriptions(subscriptions.filter(sub => sub.id !== id));
      } else {
        const errorData = await response.json();
        alert('Cancellation failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <HostNavMenu />
      <div className="w-3/4 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Types d'Abonnements Disponibles</h1>
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
          {subscriptionTypes.map(subscriptionType => (
            <li key={subscriptionType.id} className="border p-4 rounded bg-white shadow-md mb-4">
              <p><strong>Nom:</strong> {subscriptionType.name}</p>
              <p><strong>Description:</strong> {subscriptionType.description}</p>
              <p><strong>Prix:</strong> {subscriptionType.price} €</p>
              <button
                onClick={() => handleSubscribe(subscriptionType.id)}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2"
              >
                Souscrire
              </button>
            </li>
          ))}
        </ul>

        <h2 className="text-3xl font-bold text-gray-800 mt-8 mb-4">Mes Abonnements</h2>
        <ul>
          {subscriptions.length > 0 ? (
            subscriptions.map(subscription => (
              <li key={subscription.id} className="border p-4 rounded bg-white shadow-md mb-4">
                {subscription.subscriptionType && subscription.property ? (
                  <>
                    <p><strong>Nom:</strong> {subscription.subscriptionType.name}</p>
                    <p><strong>Propriété:</strong> {subscription.property.title}</p>
                    <p><strong>Début:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
                    <p><strong>Fin:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {subscription.status}</p>
                    <div className="mt-2 space-x-2">
                      <button 
                        onClick={() => handleRenew(subscription.id)}
                        className="bg-green-500 text-white font-semibold py-2 px-4 rounded"
                      >
                        Renouveler
                      </button>
                      <button 
                        onClick={() => handleCancel(subscription.id)}
                        className="bg-red-500 text-white font-semibold py-2 px-4 rounded"
                      >
                        Annuler
                      </button>
                    </div>
                  </>
                ) : (
                  <p>Les informations sur l'abonnement ou la propriété sont manquantes.</p>
                )}
              </li>
            ))
          ) : (
            <p>Aucun abonnement trouvé.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HostSubscription;
