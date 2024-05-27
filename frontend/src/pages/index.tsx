// pages/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar';

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  photos: string;
}

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/public/properties`);
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
  }, []);

  const handlePropertyClick = (id: number) => {
    router.push(`/propertyDetail?id=${id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SearchBar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property.id} className="border p-4 rounded-lg shadow-lg cursor-pointer" onClick={() => handlePropertyClick(property.id)}>
              {property.photos && property.photos.split(',').map((photo, index) => (
                <img
                  key={index}
                  crossOrigin="anonymous"
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
                  alt={`Photo de ${property.title}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
              <h2 className="text-xl font-semibold mt-2">{property.title}</h2>
              <p>{property.description}</p>
              <p>Lieu: {property.location}</p>
              <p>Prix par nuit: {property.price_per_night} €</p>
            </div>
          ))
        ) : (
          <p>Aucune propriété disponible pour le moment.</p>
        )}
      </div>
    </main>
  );
};

export default Home;
