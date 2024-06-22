// pages/host/view-property.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const ViewProperty = () => {
  const [property, setProperty] = useState<any>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
    } else if (id) {
      const fetchProperty = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProperty(data);
          } else {
            console.error('Failed to fetch property details');
          }
        } catch (error) {
          console.error('Error fetching property details:', error);
        }
      };

      const fetchAvailabilities = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}/availabilities`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setAvailabilities(data);
          } else {
            console.error('Failed to fetch availabilities');
          }
        } catch (error) {
          console.error('Error fetching availabilities:', error);
        }
      };

      fetchProperty();
      fetchAvailabilities();
    }
  }, [id, router]);

  const handleDelete = async (availabilityId: number) => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availabilities/${availabilityId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAvailabilities(availabilities.filter(a => a.id !== availabilityId));
      } else {
        alert('Erreur lors de la suppression de la disponibilité.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de la suppression de la disponibilité.');
    }
  };

  const handleEdit = (availabilityId: number) => {
    router.push(`/host/edit-availability?id=${availabilityId}&propertyId=${id}`);
  };

  if (!property) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.title}</h1>
      <p className="text-gray-700 mb-2">{property.description}</p>
      <p className="text-gray-700 mb-2">Lieu: {property.location}</p>
      <p className="text-gray-700 mb-2">Prix par nuit: {property.price_per_night} €</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {property.photos && property.photos.split(',').map((photo: string, index: number) => (
          <img
            crossOrigin="anonymous"
            key={index}
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
            alt={`Photo de ${property.title}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ))}
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded mt-4"
        onClick={() => router.push(`/host/add-availability?propertyId=${property.id}`)}
      >
        Ajouter une disponibilité
      </button>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disponibilités</h2>
        {availabilities.length > 0 ? (
          <div className="space-y-4">
            {availabilities.map((availability) => (
              <div key={availability.id} className="border p-4 rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-700"><span className="font-semibold">Début:</span> {new Date(availability.start_date).toLocaleDateString()}</p>
                    <p className="text-gray-700"><span className="font-semibold">Fin:</span> {new Date(availability.end_date).toLocaleDateString()}</p>
                    <p className="text-gray-700"><span className="font-semibold">Prix total:</span> {availability.total_price} €</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleEdit(availability.id)}
                    >
                      Modifier
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDelete(availability.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700">Aucune disponibilité ajoutée.</p>
        )}
      </div>
    </div>
  );
};

export default ViewProperty;
