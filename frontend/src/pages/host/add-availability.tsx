// pages/host/add-availability.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddAvailability = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [totalPrice, setTotalPrice] = useState('');
  const router = useRouter();
  const { propertyId } = router.query;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    if (!startDate || !endDate) {
      alert('Veuillez sélectionner des dates de début et de fin.');
      return;
    }

    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: propertyId,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          total_price: parseFloat(totalPrice),
        }),
      });

      if (response.ok) {
        router.push(`/host/view-property?id=${propertyId}`);
      } else {
        alert('Erreur lors de l\'ajout de la disponibilité.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de l’ajout de la disponibilité.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date de début *</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date de fin *</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              dateFormat="yyyy/MM/dd"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Prix total *</label>
            <input
              type="number"
              name="totalPrice"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">
            Ajouter Disponibilité
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAvailability;
