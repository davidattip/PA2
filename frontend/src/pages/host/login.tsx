// pages/host/login.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import InputGroup from '../../components/InputGroup';
import Cookie from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login Successful', data);
        Cookie.set('token', data.accessToken, { expires: 1, secure: true, sameSite: 'lax' });
        router.push('/host/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Une erreur s’est produite lors de la connexion.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <InputGroup name="email" label="Adresse Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <InputGroup name="password" label="Mot de Passe *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Connexion</button>
        </form>
        <p className="mt-4 text-center">
          <a href="/host/register" className="text-blue-600 hover:underline">Vous n'avez pas de compte ? Inscrivez-vous</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
