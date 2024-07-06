import React, { useState } from 'react';
import InputGroup1 from '../components/InputGroup1';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage('Un e-mail de réinitialisation de mot de passe a été envoyé.');
      } else {
        setMessage(data.message || 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de l\'envoi de l\'e-mail de réinitialisation.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <InputGroup1
            name="email"
            label="Adresse Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;
