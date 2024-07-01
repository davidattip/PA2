import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaSearch, FaEdit, FaTimes, FaPlusSquare, FaBan, FaUndo } from 'react-icons/fa';

type Host = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  banned: boolean;
};

const AdminHosts = () => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchHosts = async () => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts?page=${page}&limit=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPage(1);
      fetchHosts();
    }
  };

  const handleSearchClick = () => {
    setPage(1);
    fetchHosts();
  };

  const handleDelete = async (hostId: number) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts/${hostId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete host: ${response.status}`);
      }

      setHosts(hosts.filter(host => host.id !== hostId));
      console.log(`Host ${hostId} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete host:', error);
    }
  };

  const handleBan = async (hostId: number) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts/${hostId}/ban`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to ban host: ${response.status}`);
      }

      setHosts(hosts.map(host => host.id === hostId ? { ...host, banned: true } : host));
      console.log(`Host ${hostId} banned successfully`);
    } catch (error) {
      console.error('Failed to ban host:', error);
    }
  };

  const handleUnban = async (hostId: number) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts/${hostId}/unban`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to unban host: ${response.status}`);
      }

      setHosts(hosts.map(host => host.id === hostId ? { ...host, banned: false } : host));
      console.log(`Host ${hostId} unbanned successfully`);
    } catch (error) {
      console.error('Failed to unban host:', error);
    }
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-700">Liste des Hosts</h1>
          <Link href="/admin/add-host" passHref>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
              <FaPlusSquare className="mr-2" />
              Ajouter Host
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
              onKeyPress={handleKeyPress}
            />
            <div className="p-4">
              <button
                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                onClick={handleSearchClick}
              >
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
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Email</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr className="hover:bg-grey-lighter" key={host.id}>
                  <td className="py-4 px-6 border-b border-grey-light">{host.first_name}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{host.last_name}</td>
                  <td className="py-4 px-6 border-b border-grey-light">{host.email}</td>
                  <td className="py-4 px-6 border-b border-grey-light flex space-x-2">
                    <Link href={`/admin/edit-host/${host.id}`} passHref>
                      <button className="text-blue-400 hover:text-blue-600"><FaEdit /></button>
                    </Link>
                    <button onClick={() => handleDelete(host.id)} className="text-red-400 hover:text-red-600"><FaTimes /></button>
                    {!host.banned ? (
                      <button onClick={() => handleBan(host.id)} className="text-yellow-400 hover:text-yellow-600"><FaBan /></button>
                    ) : (
                      <button onClick={() => handleUnban(host.id)} className="text-green-400 hover:text-green-600"><FaUndo /></button>
                    )}
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
