import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaEdit, FaBan, FaUndo, FaTimes } from 'react-icons/fa';

const ViewUser = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookie.get('token');
        if (!token) {
          console.error('Token is not available');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const token = Cookie.get('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    const fetchProperties = async () => {
      try {
        const token = Cookie.get('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}/properties`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };

    if (id) {
      fetchUser();
      fetchBookings();
      fetchProperties();
    }
  }, [id]);

  const handleBan = async () => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}/ban`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to ban user: ${response.status}`);
      }

      setUser({ ...user, banned: true });
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  };

  const handleUnban = async () => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}/unban`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to unban user: ${response.status}`);
      }

      setUser({ ...user, banned: false });
    } catch (error) {
      console.error('Failed to unban user:', error);
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-700">Détails de l'utilisateur</h1>
      <div className="mt-4">
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Prénom:</strong> {user.first_name}</p>
        <p><strong>Nom:</strong> {user.last_name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rôle:</strong> {user.user_type}</p>
        <p><strong>Banni:</strong> {user.banned ? 'Oui' : 'Non'}</p>
        <div className="flex space-x-2 mt-4">
          {!user.banned ? (
            <button onClick={handleBan} className="bg-red-500 text-white font-semibold py-2 px-4 rounded">
              <FaBan /> Bannir
            </button>
          ) : (
            <button onClick={handleUnban} className="bg-green-500 text-white font-semibold py-2 px-4 rounded">
              <FaUndo /> Débannir
            </button>
          )}
          <Link href={`/admin/edit-user/${user.id}`} passHref>
            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded">
              <FaEdit /> Modifier
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-700">Réservations</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded mt-2">
              <p><strong>ID de la Réservation:</strong> {booking.id}</p>
              <p><strong>ID de la Propriété:</strong> {booking.property_id}</p>
              <p><strong>Date de Début:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
              <p><strong>Date de Fin:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
              <p><strong>Prix Total:</strong> {booking.total_price} €</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-gray-700">Propriétés</h2>
        <ul>
          {properties.map((property) => (
            <li key={property.id} className="border p-4 rounded mt-2">
              <p><strong>ID de la Propriété:</strong> {property.id}</p>
              <p><strong>Nom de la Propriété:</strong> {property.name}</p>
              <p><strong>Adresse:</strong> {property.address}</p>
              <p><strong>Prix par Nuit:</strong> {property.price_per_night} €</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewUser;
