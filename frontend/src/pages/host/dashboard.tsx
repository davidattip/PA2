import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import SimulationModal from '../../components/SimulationModal';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
    } else {
      // Fetch user data using the token
      const fetchUserData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
      };
      fetchUserData();
    }
  }, [router]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      {user ? (
        <div>
          <h1 className="text-2xl font-semibold text-gray-700">Bienvenue, {user.first_name} {user.last_name}</h1>
          <div className="mt-5">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => router.push('/host/properties')}>
              Gérer mes propriétés
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={() => router.push('/host/documents')}>
              Télécharger des documents
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" onClick={openModal}>
              Simuler un devis
            </button>
          </div>
          <SimulationModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default Dashboard;
