import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const TicketingPortal: React.FC = () => {
    const [person, setPerson] = useState('');
    const [level, setLevel] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const fetchUserDetails = async (token: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPerson(`${data.first_name} ${data.last_name}`);
            } else {
                router.push('/ticketing/choose_role');
            }
        } catch (error) {
            console.error('Erreur:', error);
            router.push('/ticketing/choose_role');
        }
    };

    useEffect(() => {
        const token = Cookie.get('token');
        if (!token) {
            // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de sélection de rôle
            router.push('/ticketing/choose_role');
        } else {
            fetchUserDetails(token);
        }
    }, [router, fetchUserDetails]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const token = Cookie.get('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ticket`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ person, level, description }),
            });

            if (response.ok) {
                setPerson('');
                setLevel('');
                setDescription('');
                setErrorMessage('');
                alert('Ticket créé avec succès.');
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Une erreur s’est produite lors de la création du ticket.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            setErrorMessage('Une erreur s’est produite lors de la création du ticket.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold text-center">Créer un Ticket</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="person">
                            Personne
                        </label>
                        <input
                            type="text"
                            id="person"
                            value={person}
                            readOnly
                            className="w-full px-3 py-2 border rounded bg-gray-100"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                            Niveau
                        </label>
                        <select
                            id="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        >
                            <option value="" disabled>Choisissez le niveau</option>
                            <option value="Faible">Faible</option>
                            <option value="Moyen">Moyen</option>
                            <option value="Élevé">Élevé</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        ></textarea>
                    </div>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                    )}
                    <button
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        type="submit"
                    >
                        Soumettre
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TicketingPortal;
