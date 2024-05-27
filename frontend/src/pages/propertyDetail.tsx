// pages/propertyDetail.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const PropertyDetail = () => {
  const [property, setProperty] = useState<any>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/public/properties/${id}`);
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}/availabilities`);
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
  }, [id]);

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
          crossOrigin="anonymous"
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
          alt={`Photo de ${property.title}`}
          className="mt-2 w-full h-auto"
        />
      ))}

      <h2 className="text-xl font-semibold mt-4">Disponibilités</h2>
      <ul>
        {availabilities.map((availability) => (
          <li key={availability.id}>
            Du {new Date(availability.start_date).toLocaleDateString()} au {new Date(availability.end_date).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="border p-4 rounded-lg shadow-lg">
          <div className="text-xl font-bold">
            <span className="line-through">414 €</span> 313 € par nuit
          </div>
          <form>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Arrivée</label>
                <input type="date" className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label>Départ</label>
                <input type="date" className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
            <div className="mt-4">
              <label>Voyageurs</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>1 voyageur</option>
                <option>2 voyageurs</option>
                <option>3 voyageurs</option>
                <option>4 voyageurs</option>
              </select>
            </div>
            <button className="w-full mt-4 bg-pink-500 text-white py-2 rounded">Réserver</button>
          </form>
          <div className="mt-4">
            <p className="text-gray-500">Aucun montant ne vous sera débité pour le moment</p>
            <div className="flex justify-between">
              <span>313 € x 5 nuits</span>
              <span>1567 €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de ménage</span>
              <span>92 €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de service Airbnb</span>
              <span>304 €</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>365 €</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>2328 €</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
