// components/HostNavMenu.tsx

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const HostNavMenu = () => {
  const router = useRouter();
  const activeClass = "bg-gray-300"; // Classe CSS pour le lien actif

  return (
    <nav className="w-1/4 p-4 bg-gray-200 min-h-screen">
      <ul className="space-y-2">
        <li>
          <Link href="/host/dashboard" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/dashboard' ? activeClass : ''}`}>
            Tableau de Bord
          </Link>
        </li>
        <li>
          <Link href="/host/service/host_service" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/service/host_service' ? activeClass : ''}`}>
            Vue d'ensemble des services
          </Link>
        </li>
        <li>
          <Link href="/host/subscription/hostSubscription" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/subscription/hostSubscription' ? activeClass : ''}`}>
            Gestion des abonnements
          </Link>
        </li>
        <li>
          <Link href="/host/service-history" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/service-history' ? activeClass : ''}`}>
            Services Ponctuels
          </Link>
        </li>
        <li>
          <Link href="/host/property-services" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/property-services' ? activeClass : ''}`}>
            Services par Propriété
          </Link>
        </li>
        <li>
          <Link href="/host/notifications" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/notifications' ? activeClass : ''}`}>
            Notifications et rappels
          </Link>
        </li>
        <li>
          <Link href="/host/invoices" className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/host/invoices' ? activeClass : ''}`}>
            Historique et facturation
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default HostNavMenu;
