// admin_property.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaEdit, FaTimes, FaPlusSquare } from 'react-icons/fa';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchProperties = async () => {
    try {
      const response = await fetch(`https://votre-domaine.com/backoffice/properties?page=${page}&limit=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_admin')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProperties(data.properties);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-700">Liste des Propriétés</h1>
          <Link href="/admin/add-property">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <FaPlusSquare className="mr-2" />Ajouter Propriété
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
                  fetchProperties();
                }
              }}
            />
            <div className="p-4">
              <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                      onClick={() => {
                        setPage(1);
                        fetchProperties();
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
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Titre</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Description</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Localisation</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Prix par Nuit</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Souscrit</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Image Validée</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr className="hover:bg-grey-lighter" key={property.id}>
                  <td className="py-4 px-6 border-b border-grey-light">{property.title}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{property.description}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{property.location}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{property.price_per_night}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{property.subscribed ? 'Oui' : 'Non'}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{property.image_validated ? 'Oui' : 'Non'}</td>
                  <td className="py-4 px-6 border-b border-grey-light flex space-x-2">
                    <Link href={`/admin/edit-property/${property.id}`}>
                      <button className="text-blue-400 hover:text-blue-600"><FaEdit /></button>
                    </Link>
                    <Link href={`/admin/delete-property/${property.id}`}>
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

export default AdminProperties;
