import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const AddUser = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    user_type: 'admin',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const token = Cookie.get('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/backoffice/users/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`Failed to add user: ${response.statusText}`);
      }
      router.push('/admin_users'); // Redirection vers la liste des utilisateurs
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-teal-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Formulaire d’ajout</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom:</label>
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
            <label className="block text-sm font-medium text-gray-700">Nom:</label>
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
            <label className="block text-sm font-medium text-gray-700">Mot de passe:</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmation du mot de passe:</label>
            <input
              type="password"
              name="confirm_password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Ajouter
            </button>
          </div>
          {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default AddUser;
