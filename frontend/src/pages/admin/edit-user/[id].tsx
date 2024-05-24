import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
};

const EditUser = () => {
  const router = useRouter();
  const { id } = router.query; // Extraction de l'identifiant de l'utilisateur depuis l'URL
  const [user, setUser] = useState<User | null>(null);
  const [initialUser, setInitialUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const fetchUser = async () => {
        try {
          const token = Cookie.get('token');
          if (!token) {
            throw new Error('No token found');
          }
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
          }
          const data: User = await response.json();
          setUser(data);
          setInitialUser(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to fetch user data.');
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleUpdateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user && initialUser && typeof id === 'string') {
      const updatedFields: Partial<User> = {};
      (Object.keys(user) as (keyof User)[]).forEach(key => {
        if (user[key] !== initialUser[key]) {
          if (user[key] !== undefined) {
            updatedFields[key] = user[key]!;
          }
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        console.log('No changes detected.');
        return;
      }

      try {
        const token = Cookie.get('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedFields),
        });
        if (!response.ok) {
          throw new Error(`Failed to update user data: ${response.statusText}`);
        }
        router.push('/admin_users'); // Redirection vers la liste des utilisateurs
      } catch (error) {
        console.error('Error updating user data:', error);
        setError('Failed to update user data.');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => prevState ? { ...prevState, [name]: value } : null);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">User not found</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User Type:</label>
            <input
              type="text"
              name="user_type"
              value={user.user_type}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default EditUser;
