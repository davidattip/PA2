import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InputGroup1 from '../components/InputGroup1';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.');
      } else {
        setMessage(data.message || 'Erreur lors de la réinitialisation du mot de passe.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <InputGroup1
            name="password"
            label="Nouveau Mot de Passe *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            Réinitialiser le mot de passe
          </button>
          {message && (
            <div className="mt-4 text-center text-green-500">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
