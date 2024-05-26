// pages/host/edit-availability.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const EditAvailability = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
    } else if (id) {
      // Fetch availability details using the token and availability ID
      const fetchAvailability = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availabilities/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setStartDate(data.start_date.split('T')[0]); // Assurez-vous que la date est correctement formatée
            setEndDate(data.end_date.split('T')[0]); // Assurez-vous que la date est correctement formatée
            setTotalPrice(data.total_price);
          } else {
            console.error('Failed to fetch availability details');
          }
        } catch (error) {
          console.error('Error fetching availability details:', error);
        }
      };
      fetchAvailability();
    }
  }, [id, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availabilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          total_price: parseFloat(totalPrice),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/host/view-property?id=${data.property_id}`);
      } else {
        alert('Erreur lors de la modification de la disponibilité.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de la modification de la disponibilité.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date de début *</label>
            <input
              type="date"
              name="start_date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date de fin *</label>
            <input
              type="date"
              name="end_date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Prix total *</label>
            <input
              type="number"
              name="total_price"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Modifier</button>
        </form>
      </div>
    </div>
  );
};

export default EditAvailability;
