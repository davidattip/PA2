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
    router.push(`/host/edit-availability?id=${availabilityId}`);
  };

  if (!property) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-700">{property.title}</h1>
      <p>{property.description}</p>
      <p>Lieu: {property.location}</p>
      <p>Prix par nuit: {property.price_per_night} €</p>
      {property.photos && property.photos.split(',').map((photo: string, index: number) => (
        <img
          key={index}
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
          alt={`Photo de ${property.title}`}
          className="mt-2 w-full h-auto"
        />
      ))}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
        onClick={() => router.push(`/host/add-availability?propertyId=${property.id}`)}
      >
        Ajouter une disponibilité
      </button>
      <div className="mt-5">
        <h2 className="text-xl font-semibold text-gray-700">Disponibilités</h2>
        {availabilities.length > 0 ? (
          <ul>
            {availabilities.map((availability) => (
              <li key={availability.id} className="border p-4 rounded mt-2">
                <p>Début: {new Date(availability.start_date).toLocaleDateString()}</p>
                <p>Fin: {new Date(availability.end_date).toLocaleDateString()}</p>
                <p>Prix total: {availability.total_price} €</p>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
                  onClick={() => handleEdit(availability.id)}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => handleDelete(availability.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune disponibilité ajoutée.</p>
        )}
      </div>
    </div>
  );
};

export default ViewProperty;
