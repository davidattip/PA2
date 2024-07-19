import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { FaSearch, FaUserEdit, FaUserTimes, FaEye } from 'react-icons/fa';

type Contractor = {
  id: number;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  company_name: string;
  siret: string;
};

const AdminContractors = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const fetchContractors = async () => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/contractors?page=${page}&limit=10&search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setContractors(data.contractors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch contractors:', error);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, [page, search]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPage(1);
      fetchContractors();
    }
  };

  const handleSearchClick = () => {
    setPage(1);
    fetchContractors();
  };

  const handleDelete = async (contractorId: number) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/contractors/${contractorId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete contractor: ${response.status}`);
      }

      setContractors(contractors.filter(contractor => contractor.id !== contractorId));
      console.log(`Contractor ${contractorId} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete contractor:', error);
    }
  };

  return (
      <div>
        <div className="container mx-auto p-6">
          <div className="mb-5 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-700">Liste des Contractors</h1>
          </div>
          <div className="mb-5">
            <div className="flex bg-white items-center rounded-full shadow-xl">
              <input
                  className="rounded-l-full w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
                  id="search"
                  type="text"
                  placeholder="Que recherchez-vous?"
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
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Nom</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Prénom</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Email</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Entreprise</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">SIRET</th>
                <th className="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light">Actions</th>
              </tr>
              </thead>
              <tbody>
              {contractors.map((contractor) => (
                  <tr className="hover:bg-grey-lighter" key={contractor.id}>
                    <td className="py-4 px-6 border-b border-grey-light">{contractor.contact_last_name}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{contractor.contact_first_name}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{contractor.email}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{contractor.company_name}</td>
                    <td className="py-4 px-6 border-b border-grey-light">{contractor.siret}</td>
                    <td className="py-4 px-6 border-b border-grey-light flex space-x-2">
                      <Link href={`/adminContractor/edit-contractor/${contractor.id}`} passHref>
                        <button className="text-blue-400 hover:text-blue-600"><FaUserEdit /></button>
                      </Link>
                      <Link href={`/adminContractor/view-contractor/${contractor.id}`} passHref>
                        <button className="text-green-400 hover:text-green-600"><FaEye /></button>
                      </Link>
                      <button onClick={() => handleDelete(contractor.id)} className="text-red-400 hover:text-red-600"><FaUserTimes /></button>
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

export default AdminContractors;
