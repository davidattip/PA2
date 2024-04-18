// admin_hosts.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaEdit, FaTimes, FaPlusSquare } from 'react-icons/fa';

const AdminHosts = () => {
  const [hosts, setHosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchHosts = async () => {
    try {
      const response = await fetch(`https://votre-domaine.com/backoffice/hosts?page=${page}&limit=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token_admin')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHosts(data.hosts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch hosts:', error);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, [page, search]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-700">Liste des Hosts</h1>
          <Link href="/admin/add-host">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <FaPlusSquare className="mr-2" />Ajouter Host
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
                  fetchHosts();
                }
              }}
            />
            <div className="p-4">
              <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                      onClick={() => {
                        setPage(1);
                        fetchHosts();
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
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Prénom</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Nom</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr className="hover:bg-grey-lighter" key={host.id}>
                  <td className="py-4 px-6 border-b border-grey-light">{host.first_name}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{host.last_name}</td>
                  <td className="py-4 px-6 border-b border-grey-light flex space-x-2">
                    <Link href={`/admin/edit-host/${host.id}`}>
                      <button className="text-blue-400 hover:text-blue-600"><FaEdit /></button>
                    </Link>
                    <Link href={`/admin/delete-host/${host.id}`}>
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

export default AdminHosts;

