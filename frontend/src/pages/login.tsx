import React, { useState } from 'react';
import { useRouter } from 'next/router'; // Importation du hook useRouter pour la redirection
import InputGroup1 from '../components/InputGroup1'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Création d'une instance du useRouter

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log('Login Successful', data);
        // Stockez l'accessToken et redirigez l'utilisateur où vous le souhaitez
        // par exemple : router.push('/dashboard');
      } else if (response.status === 400) {
        // Gérez le cas d'un mot de passe incorrect
        alert(data.message);
      } else if (response.status === 404) {
        // Gérez le cas d'un utilisateur non trouvé
        alert(data.message);
      } else {
        // Gérez d'autres réponses inattendues
        throw new Error('Une erreur s’est produite lors de la connexion.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur s’est produite lors de la connexion.');
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
          <button
            className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            type="submit"
          >
            Connexion
          </button>
          <p className="mt-4 text-center">
            <a href="/signup" className="text-blue-600 hover:underline">
              Pas encore inscrit? Créer un compte
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
