// pages/host/edit-property.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import InputGroup from '../../components/InputGroup';

const EditProperty = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
    } else if (id) {
      // Fetch property details using the token and property ID
      const fetchProperty = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTitle(data.title);
            setDescription(data.description);
            setLocation(data.location);
            setPricePerNight(data.price_per_night.toString());
            // Photos will be handled separately
          } else {
            console.error('Failed to fetch property details');
          }
        } catch (error) {
          console.error('Error fetching property details:', error);
        }
      };
      fetchProperty();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === 'photos') {
      setPhotos(files);
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
    if (photos) {
      Array.from(photos).forEach(photo => {
        formData.append('photos', photo);
      });
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push('/host/properties');
      } else {
        alert('Erreur lors de la modification de la propriété.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de la modification de la propriété.');
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
            <label className="block text-gray-700">Photos *</label>
            <input
              type="file"
              name="photos"
              multiple
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Modifier</button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
