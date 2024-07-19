import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AdminSidebar = () => {
  const router = useRouter();
  const activeClass = "bg-gray-300"; // Classe CSS pour le lien actif

  return (
    <nav className="w-1/4 p-4 bg-gray-200 min-h-screen">
      <ul className="space-y-2">
        <li>
          <Link href="/admin/dashboard" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/admin/dashboard' ? activeClass : ''}`}>Tableau de Bord</a>
          </Link>
        </li>
        <li>
          <Link href="/adminService/service" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminService/service' ? activeClass : ''}`}>Services</a>
          </Link>
        </li>
        <li>
          <Link href="/adminSubscription/subscription" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminSubscription/subscription' ? activeClass : ''}`}>Abonnements</a>
          </Link>
        </li>
        <li>
          <Link href="/adminService/history" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminService/history' ? activeClass : ''}`}>Historique des Services</a>
          </Link>
        </li>
        <li>
          <Link href="/adminSubscription/history" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminSubscription/history' ? activeClass : ''}`}>Historique des Abonnements</a>
          </Link>
        </li>
        <li>
          <Link href="/adminService/property-services" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminService/property-services' ? activeClass : ''}`}>Services par Propriété</a>
          </Link>
        </li>
        <li>
          <Link href="/adminSubscription/property-subscriptions" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminSubscription/property-subscriptions' ? activeClass : ''}`}>Abonnements par Propriété</a>
          </Link>
        </li>
        <li>
          <Link href="/adminService/notifications" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminService/notifications' ? activeClass : ''}`}>Notifications</a>
          </Link>
        </li>
        <li>
          <Link href="/adminService/invoices" legacyBehavior>
            <a className={`block p-2 rounded hover:bg-gray-300 ${router.pathname === '/adminService/invoices' ? activeClass : ''}`}>Factures</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;
