// components/MainLayout.tsx
import React from 'react';
import { useRouter } from 'next/router';

const menuItems = [
  { name: 'Tableau de Bord', href: '/mon-espace' },
  { name: 'Locations', href: '#' },
  { name: 'Paiements', href: '#' },
  { name: 'Demandes de Service', href: '#' },
  { name: 'Messages', href: '#' },
  { name: 'Documents', href: '#' },
  { name: 'Profil', href: '/renter/profil' },
  { name: 'Assistance', href: '#' },
  { name: 'Avis', href: '#' },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="flex">
      {/* Menu de Navigation */}
      <nav className="w-64 h-screen bg-gray-800 text-white p-6">
        <div className="text-2xl font-bold mb-8">Mon Espace</div>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-4">
              <a href={item.href} className="block p-2 hover:bg-gray-700 rounded">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* Contenu Principal */}
      <div className="flex-1 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
