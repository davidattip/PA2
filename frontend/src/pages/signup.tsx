// pages/signup.tsx
import { useState } from 'react';
// ... Importez les autres composants et hooks dont vous avez besoin.

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Ajoutez d'autres états pour les champs supplémentaires si nécessaire.

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validation côté client avant envoi...

    try {
      const response = await fetch('API_ENDPOINT/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password /* autres champs */ }),
      });
      // Gestion de la réponse de l'API...
    } catch (error) {
      // Gestion des erreurs...
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <input
            className="w-full px-3 py-2 border rounded text-gray-700"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-3 py-2 border rounded text-gray-700"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Ajoutez d'autres champs d'input si nécessaire */}
          <button 
          className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          type="submit">
            S'inscrire</button>
        </form>
      </div>
    </div>
  );
}
