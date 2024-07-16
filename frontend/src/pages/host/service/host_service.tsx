// host_service.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  propertyName?: string;
  status: string;
}

interface Subscription {
  id: number;
  name: string;
  price: number;
  description: string;
  status: string;
}

const HostService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/services`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setServices(data.services);
        setSubscriptions(data.subscriptions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <nav className="w-1/4 p-4 bg-gray-200 min-h-screen">
        <ul className="space-y-2">
          <li><Link href="/host/dashboard" className="block p-2 rounded hover:bg-gray-300">Tableau de Bord</Link></li>
          <li><Link href="/host/service" className="block p-2 rounded hover:bg-gray-300">Mes Services</Link></li>
          <li><Link href="/host/subscription" className="block p-2 rounded hover:bg-gray-300">Mes Abonnements</Link></li>
          <li><Link href="/host/service-history" className="block p-2 rounded hover:bg-gray-300">Historique des Services</Link></li>
          <li><Link href="/host/property-services" className="block p-2 rounded hover:bg-gray-300">Services par Propriété</Link></li>
          <li><Link href="/host/notifications" className="block p-2 rounded hover:bg-gray-300">Notifications</Link></li>
          <li><Link href="/host/invoices" className="block p-2 rounded hover:bg-gray-300">Factures</Link></li>
        </ul>
      </nav>
      <div className="w-3/4 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mes Services</h1>

        {/* Vue d'ensemble des services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Vue d'ensemble des services</h2>
          <ul>
            {services.map(service => (
              <li key={service.id} className="border p-4 rounded bg-white shadow-md mb-4">
                <p><strong>Nom:</strong> {service.name}</p>
                <p><strong>Description:</strong> {service.description}</p>
                <p><strong>Prix:</strong> {service.price} €</p>
                <p><strong>Statut:</strong> {service.status}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Gestion des abonnements */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Gestion des abonnements</h2>
          <ul>
            {subscriptions.map(subscription => (
              <li key={subscription.id} className="border p-4 rounded bg-white shadow-md mb-4">
                <p><strong>Nom de l'abonnement:</strong> {subscription.name}</p>
                <p><strong>Prix:</strong> {subscription.price} € / an</p>
                <p><strong>Description:</strong> {subscription.description}</p>
                <p><strong>Statut:</strong> {subscription.status}</p>
                <div className="mt-2 space-x-2">
                  <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded">Modifier</button>
                  <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded">Annuler</button>
                  <button className="bg-green-500 text-white font-semibold py-2 px-4 rounded">Renouveler</button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Services ponctuels */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Services Ponctuels</h2>
          <ul>
            {services.map(service => (
              <li key={service.id} className="border p-4 rounded bg-white shadow-md mb-4">
                <p><strong>Nom du service:</strong> {service.name}</p>
                <p><strong>Prix:</strong> {service.price} €</p>
                <p><strong>Description:</strong> {service.description}</p>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2">Acheter ce service</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Gestion des services pour les propriétés */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Services par Propriété</h2>
          <ul>
            {services.map(service => (
              <li key={service.id} className="border p-4 rounded bg-white shadow-md mb-4">
                <p><strong>Nom de la propriété:</strong> {service.propertyName}</p>
                <p><strong>Services:</strong> {service.name}</p>
                <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded mt-2">Supprimer ce service</button>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications et rappels */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Notifications et rappels</h2>
          <p className="border p-4 rounded bg-white shadow-md">Notifications de renouvellement et alertes de service apparaîtront ici.</p>
        </section>

        {/* Historique et facturation */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Historique et facturation</h2>
          <p className="border p-4 rounded bg-white shadow-md">Historique des transactions et factures téléchargeables apparaîtront ici.</p>
        </section>
      </div>
    </div>
  );
};

export default HostService;
