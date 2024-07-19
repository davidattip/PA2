import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

interface SubscriptionType {
  id: number;
  name: string;
  description: string;
  price: number;
  targetUser: string;
}

const SubscriptionPage = () => {
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionTypes = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/subscription-types`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSubscriptionTypes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscription types:', error);
        setLoading(false);
      }
    };

    fetchSubscriptionTypes();
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/subscription-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSubscriptionTypes(subscriptionTypes.filter(subscriptionType => subscriptionType.id !== id));
      } else {
        console.error('Failed to delete subscription type');
      }
    } catch (error) {
      console.error('Error deleting subscription type:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="w-3/4 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestion des Abonnements</h1>
        <div className="mb-4">
            <Link href="/adminSubscription/addSubscriptionType" legacyBehavior>
                <a className="bg-green-500 text-white font-semibold py-2 px-4 rounded">Ajouter un Type d'Abonnement</a>
            </Link>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Nom</th>
              <th className="py-2">Description</th>
              <th className="py-2">Prix</th>
              <th className="py-2">Cible</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptionTypes.map(subscriptionType => (
              <tr key={subscriptionType.id} className="border-t">
                <td className="py-2 px-4">{subscriptionType.name}</td>
                <td className="py-2 px-4">{subscriptionType.description}</td>
                <td className="py-2 px-4">{subscriptionType.price} €</td>
                <td className="py-2 px-4">{subscriptionType.targetUser}</td>
                <td className="py-2 px-4">
                  <Link href={`/adminSubscription/subscription/edit/${subscriptionType.id}`} legacyBehavior>
                    <a className="bg-blue-500 text-white font-semibold py-1 px-3 rounded mr-2">Modifier</a>
                  </Link>
                  <button
                    onClick={() => handleDelete(subscriptionType.id)}
                    className="bg-red-500 text-white font-semibold py-1 px-3 rounded"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionPage;
