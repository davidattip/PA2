import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SearchBar from '../components/SearchBar';
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

const Home: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/public/properties`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
          setFilteredProperties(data); // Initialize filtered properties
        } else {
          console.error('Failed to fetch properties');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (criteria: { destination: string; arrival: string; departure: string; guests: string }) => {
    let filtered = properties;

    if (criteria.destination) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(criteria.destination.toLowerCase())
      );
    }

    // Add additional filtering logic for arrival, departure, and guests if needed

    setFilteredProperties(filtered);
  };

  const handlePropertyClick = (id: number) => {
    router.push(`/propertyDetail?id=${id}`);
  };

  return (
    <main className="flex flex-col items-center justify-between p-6 bg-gray-100 min-h-screen">
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
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
                <h2
                  className="text-2xl font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
                  onClick={() => handlePropertyClick(property.id)}
                >
                  {property.title}
                </h2>
                <p className="text-gray-600 mt-2">{property.description}</p>
                <p className="text-gray-600 mt-2">Lieu: {property.location}</p>
                <p className="text-gray-600 mt-2">Prix par nuit: {property.price_per_night} €</p>
              </div>
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
