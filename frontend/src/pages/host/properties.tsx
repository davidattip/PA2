import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

// Définir une interface pour le type Property
interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  photos: string;
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
    } else {
      // Fetch properties using the token
      const fetchProperties = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProperties(data);
          } else {
            console.error('Failed to fetch properties');
          }
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      };
      fetchProperties();
    }
  }, [router]);

  const handleDelete = async (id: number) => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProperties(properties.filter((property) => property.id !== id));
      } else {
        alert('Erreur lors de la suppression de la propriété.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Une erreur s’est produite lors de la suppression de la propriété.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-700">Mes Propriétés</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
        onClick={() => router.push('/host/add-property')}
      >
        Ajouter une propriété
      </button>
      <div className="mt-5">
        {properties.length > 0 ? (
          <ul>
            {properties.map((property) => (
              <li key={property.id} className="border p-4 rounded mt-2">
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p>{property.description}</p>
                <p>Lieu: {property.location}</p>
                <p>Prix par nuit: {property.price_per_night} €</p>
                {property.photos && property.photos.split(',').map((photo, index) => (
                  <img
                    key={index}
                    crossOrigin="anonymous"
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                    alt={`Photo de ${property.title}`}
                    className="mt-2 w-full h-auto"
                  />
                ))}
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => router.push(`/host/edit-property?id=${property.id}`)}
                >
                  Modifier
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => handleDelete(property.id)}
                >
                  Supprimer
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => router.push(`/host/view-property?id=${property.id}`)}
                >
                  Consulter
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Vous n'avez pas encore ajouté de propriétés.</p>
        )}
      </div>
    </div>
  );
};

export default Properties;
