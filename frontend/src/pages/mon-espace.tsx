// pages/mon-espace.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const MonEspace = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchUserInfo();
    fetchBookings();
  }, [router]);

  if (!userInfo) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-700">Mon Espace</h1>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Informations Personnelles</h2>
        <p>Nom: {userInfo.first_name} {userInfo.last_name}</p>
        <p>Email: {userInfo.email}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Mes Réservations</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded mt-2">
              <p>Propriété ID: {booking.property_id}</p>
              <p>Date de début: {new Date(booking.start_date).toLocaleDateString()}</p>
              <p>Date de fin: {new Date(booking.end_date).toLocaleDateString()}</p>
              <p>Prix total: {booking.total_price} €</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MonEspace;
