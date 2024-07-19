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
  chosen_contractor: number | null;
}

interface Contractor {
  id: number;
  email: string;
  contact_first_name: string;
  contact_last_name: string;
}

const ServicePage = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedContractor, setSelectedContractor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const [serviceResponse, contractorResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/service-types`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contractors`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }),
        ]);

        const serviceData = await serviceResponse.json();
        const contractorData = await contractorResponse.json();

        setServiceTypes(serviceData);
        setContractors(contractorData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
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

  const handleAssignService = async (serviceTypeId: number) => {
    const token = Cookie.get('token');
    if (!token || !selectedContractor) {
      alert('Veuillez sélectionner un contractor.');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/assign-service`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceTypeId,
          contractorId: selectedContractor,
        }),
      });

      if (response.ok) {
        alert('Service attribué avec succès!');
        const updatedService = await response.json();
        setServiceTypes(serviceTypes.map(st => st.id === updatedService.id ? updatedService : st));
      } else {
        const errorData = await response.json();
        alert('Échec de l\'attribution du service : ' + errorData.message);
      }
    } catch (error) {
      console.error('Error assigning service:', error);
    }
  };

  const getContractorName = (contractorId: number | null): string => {
    if (contractorId === null) return 'Non attribué';
    const contractor = contractors.find(contractor => contractor.id === contractorId);
    return contractor ? `${contractor.contact_first_name} ${contractor.contact_last_name}` : 'Non attribué';
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
        <div className="mb-4">
          <label htmlFor="contractorSelect" className="block text-gray-700">Sélectionnez un contractor:</label>
          <select
            id="contractorSelect"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={selectedContractor || ''}
            onChange={(e) => setSelectedContractor(Number(e.target.value))}
          >
            <option value="" disabled>Choisir un contractor</option>
            {contractors.map((contractor) => (
              <option key={contractor.id} value={contractor.id}>{contractor.contact_first_name} {contractor.contact_last_name}</option>
            ))}
          </select>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Nom</th>
              <th className="py-2">Description</th>
              <th className="py-2">Prix</th>
              <th className="py-2">Cible</th>
              <th className="py-2">Contractor Assigné</th>
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
                <td className="py-2 px-4">{getContractorName(serviceType.chosen_contractor)}</td>
                <td className="py-2 px-4">
                  <Link href={`/adminService/service/edit/${serviceType.id}`} legacyBehavior>
                    <a className="bg-blue-500 text-white font-semibold py-1 px-3 rounded mr-2">Modifier</a>
                  </Link>
                  <button
                    onClick={() => handleDelete(serviceType.id)}
                    className="bg-red-500 text-white font-semibold py-1 px-3 rounded mr-2"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => handleAssignService(serviceType.id)}
                    className="bg-yellow-500 text-white font-semibold py-1 px-3 rounded"
                  >
                    Assigner
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
