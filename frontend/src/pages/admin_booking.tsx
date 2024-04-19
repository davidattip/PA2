// admin_booking.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaSearch, FaEdit, FaTimes, FaPlusSquare } from 'react-icons/fa';

type Booking = {
    id: number;
    property_id: number;
    host_id: number;
    user_id: number;
    start_date: string;
    end_date: string;
    total_price: number;
  };

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backoffice/bookings?page=${page}&limit=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_admin')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-700">Liste des Réservations</h1>
          <Link href="/admin/add-booking">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <FaPlusSquare className="mr-2" />Ajouter Réservation
            </button>
          </Link>
        </div>
        <div className="mb-5">
          <div className="flex bg-white items-center rounded-full shadow-xl">
            <input
              className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
              id="search"
              type="text"
              placeholder="Recherche..."
              value={search}
              onChange={handleSearch}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  setPage(1);
                  fetchBookings();
                }
              }}
            />
            <div className="p-4">
              <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                      onClick={() => {
                        setPage(1);
                        fetchBookings();
                      }}>
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded my-6">
          <table className="text-left w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Property ID</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Host ID</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">User ID</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Start Date</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">End Date</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Total Price</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr className="hover:bg-grey-lighter" key={booking.id}>
                  <td className="py-4 px-6 border-b border-grey-light">{booking.property_id}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{booking.host_id}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{booking.user_id}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{booking.start_date}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{booking.end_date}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{booking.total_price}</td>
                  <td className="py-4 px-6 border-b border-grey-light flex space-x-2">
                    <Link href={`/admin/edit-booking/${booking.id}`}>
                      <button className="text-blue-400 hover:text-blue-600"><FaEdit /></button>
                    </Link>
                    <Link href={`/admin/delete-booking/${booking.id}`}>
                      <button className="text-red-400 hover:text-red-600"><FaTimes /></button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-4 py-2 mx-1 rounded ${page === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
