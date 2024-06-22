// pages/host/edit-availability.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';

const EditAvailability = () => {
  const [totalPrice, setTotalPrice] = useState('');
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const router = useRouter();
  const { id, propertyId } = router.query;
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    if (startDateRef.current && endDateRef.current) {
      flatpickr(startDateRef.current, {
        locale: French,
        dateFormat: "d/m/Y",
        minDate: "today", // Restrict selection to today or later
        plugins: [new rangePlugin({ input: endDateRef.current })]
      });
    }
  }, []);

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    const fetchAvailabilities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${propertyId}/availabilities`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvailabilities(data);
        } else {
          console.error('Erreur lors de la récupération des disponibilités.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchAvailability = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availabilities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          (startDateRef.current as any).flatpickr.setDate(new Date(data.start_date), false);
          (endDateRef.current as any).flatpickr.setDate(new Date(data.end_date), false);
          setTotalPrice(data.total_price);
        } else {
          console.error('Failed to fetch availability details');
        }
      } catch (error) {
        console.error('Error fetching availability details:', error);
      }
    };

    if (id) {
      fetchAvailability();
      fetchAvailabilities();
    }
  }, [id, propertyId, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    const startDate = (startDateRef.current as any).value;
    const endDate = (endDateRef.current as any).value;

    if (!startDate || !endDate) {
      alert('Veuillez sélectionner des dates de début et de fin.');
      return;
    }

    // Conversion des dates pour s'assurer qu'elles sont valides
    const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
    const [endDay, endMonth, endYear] = endDate.split('/').map(Number);

    const parsedStartDate = new Date(startYear, startMonth - 1, startDay);
    const parsedEndDate = new Date(endYear, endMonth - 1, endDay);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      alert('Veuillez sélectionner des dates valides.');
      return;
    }

    const today = new Date();
    if (parsedStartDate < today) {
      alert('La date de début ne peut pas être antérieure à la date du jour.');
      return;
    }

    // Vérifier les conflits de dates
    const isConflict = availabilities.some(availability => {
      if (availability.id.toString() === id) return false; // Skip the current availability being edited
      const existingStartDate = new Date(availability.start_date);
      const existingEndDate = new Date(availability.end_date);
      return (parsedStartDate <= existingEndDate && parsedEndDate >= existingStartDate);
    });

    if (isConflict) {
      alert('Les dates sélectionnées se chevauchent avec des disponibilités existantes.');
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
          start_date: parsedStartDate.toISOString(),
          end_date: parsedEndDate.toISOString(),
          total_price: parseFloat(totalPrice),
        }),
      });

      if (response.ok) {
        router.push(`/host/view-property?id=${propertyId}`);
      } else {
        alert('Erreur lors de la modification de la disponibilité.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de la modification de la disponibilité.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Date de début *</label>
            <input
              type="text"
              id="startDate"
              ref={startDateRef}
              className="w-full px-3 py-2 border rounded"
              placeholder="Sélectionner la date de début"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date de fin *</label>
            <input
              type="text"
              id="endDate"
              ref={endDateRef}
              className="w-full px-3 py-2 border rounded"
              placeholder="Sélectionner la date de fin"
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
            Modifier
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditAvailability;
