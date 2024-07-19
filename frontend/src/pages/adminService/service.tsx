import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import Link from 'next/link';
import AdminSidebar from '../../components/AdminSidebar';

interface ServiceType {
  id: number;
  name: string;
  description: string;
  price: number;
  targetUser: string;
}

const ServicePage = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServiceTypes = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/service-types`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setServiceTypes(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service types:', error);
        setLoading(false);
      }
    };

    fetchServiceTypes();
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/service-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setServiceTypes(serviceTypes.filter(serviceType => serviceType.id !== id));
      } else {
        console.error('Failed to delete service type');
      }
    } catch (error) {
      console.error('Error deleting service type:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="w-3/4 p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Gestion des Services</h1>
        <div className="mb-4">
            <Link href="/adminService/addServiceType" legacyBehavior>
                <a className="bg-green-500 text-white font-semibold py-2 px-4 rounded">Ajouter un Type de Service</a>
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
            {serviceTypes.map(serviceType => (
              <tr key={serviceType.id} className="border-t">
                <td className="py-2 px-4">{serviceType.name}</td>
                <td className="py-2 px-4">{serviceType.description}</td>
                <td className="py-2 px-4">{serviceType.price} €</td>
                <td className="py-2 px-4">{serviceType.targetUser}</td>
                <td className="py-2 px-4">
                  <Link href={`/adminService/service/edit/${serviceType.id}`} legacyBehavior>
                    <a className="bg-blue-500 text-white font-semibold py-1 px-3 rounded mr-2">Modifier</a>
                  </Link>
                  <button
                    onClick={() => handleDelete(serviceType.id)}
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

export default ServicePage;
