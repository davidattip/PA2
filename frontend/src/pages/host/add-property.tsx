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
  const [photos, setPhotos] = useState<File[]>([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'photos' && files) {
      setPhotos([...photos, ...Array.from(files)].slice(0, 4)); // Limite à 4 photos
    } else {
      switch (name) {
        case 'title':
          setTitle(value);
          break;
        case 'description':
          setDescription(value);
          break;
        case 'location':
          setLocation(value);
          break;
        case 'pricePerNight':
          setPricePerNight(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('price_per_night', pricePerNight);
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
          <InputGroup name="title" label="Titre *" type="text" value={title} onChange={handleChange} />
          <InputGroup name="description" label="Description *" type="text" value={description} onChange={handleChange} />
          <InputGroup name="location" label="Lieu *" type="text" value={location} onChange={handleChange} />
          <InputGroup name="pricePerNight" label="Prix par nuit *" type="number" value={pricePerNight} onChange={handleChange} />
          <div className="mb-4">
            <label className="block text-gray-700">Photos (jusqu'à 4) *</label>
            <input
              type="file"
              name="photos"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Ajouter</button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
