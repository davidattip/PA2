// pages/host/add-property.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import InputGroup from '../../components/InputGroup';

const AddProperty = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          location,
          price_per_night: parseFloat(pricePerNight),
        }),
      });

      if (response.ok) {
        router.push('/host/properties');
      } else {
        alert('Erreur lors de l\'ajout de la propriété.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de l’ajout de la propriété.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <InputGroup name="title" label="Titre *" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          <InputGroup name="description" label="Description *" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          <InputGroup name="location" label="Lieu *" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          <InputGroup name="pricePerNight" label="Prix par nuit *" type="number" value={pricePerNight} onChange={(e) => setPricePerNight(e.target.value)} />
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
