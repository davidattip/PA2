// pages/host/properties.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

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
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Mes Propriétés</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-6"
        onClick={() => router.push('/host/add-property')}
      >
        Ajouter une propriété
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-64"
              >
                {property.photos && property.photos.split(',').map((photo, index) => (
                  <SwiperSlide key={index}>
                    <img
                      crossOrigin="anonymous"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                      alt={`Photo de ${property.title}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="p-4">
                <h2 className="text-2xl font-bold text-gray-800">{property.title}</h2>
                <p className="text-gray-600 mt-2">{property.description}</p>
                <p className="text-gray-600 mt-2">Lieu: {property.location}</p>
                <p className="text-gray-600 mt-2">Prix par nuit: {property.price_per_night} €</p>
                <div className="flex mt-4 space-x-2">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push(`/host/edit-property?id=${property.id}`)}
                  >
                    Modifier
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(property.id)}
                  >
                    Supprimer
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push(`/host/view-property?id=${property.id}`)}
                  >
                    Consulter
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">Vous n'avez pas encore ajouté de propriétés.</p>
        )}
      </div>
    </div>
  );
};

export default Properties;
