import React, { useState } from 'react';
import InputGroup1 from '../components/InputGroup1';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage('Inscription réussie. Veuillez vérifier votre e-mail pour activer votre compte.');
      } else {
        throw new Error(data.message || 'Erreur lors de la création de l’utilisateur.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de l\'inscription. Veuillez réessayer.');
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
          <InputGroup1
            name="password"
            label="Mot de Passe *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputGroup1
            name="first_name"
            label="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <InputGroup1
            name="last_name"
            label="Nom de Famille"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <button
            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            S'inscrire
          </button>
          <p className="mt-4 text-center">
            <a href="/login" className="text-blue-600 hover:underline">
              Vous avez déjà un compte? Connexion
            </a>
          </p>
          {message && (
            <div className="mt-4 text-center text-green-500">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
