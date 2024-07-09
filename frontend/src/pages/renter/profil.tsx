import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import MainLayout from '../../components/MainLayout';

const Profil: React.FC = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/renter/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserInfo(data);
                    setFirstName(data.first_name || ''); // Ajoutez || '' pour gérer les valeurs nulles
                    setLastName(data.last_name || ''); // Ajoutez || '' pour gérer les valeurs nulles
                } else {
                    console.error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSaveProfile = async () => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/renter/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ firstName, lastName }),
            });

            if (response.ok) {
                alert('Profil mis à jour avec succès');
            } else {
                alert('Erreur lors de la mise à jour du profil');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour du profil');
        }
    };

    const handleChangeEmail = async () => {
        const token = Cookie.get('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/renter/initiate-email-change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newEmail }),
            });

            if (response.ok) {
                alert('Email de vérification envoyé');
            } else {
                alert('Erreur lors de l\'envoi de l\'email de vérification');
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            alert('Erreur lors de l\'envoi de l\'email de vérification');
        }
    };

    if (!userInfo) {
        return <p>Chargement...</p>;
    }

    return (
        <MainLayout>
            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-semibold text-gray-700">Profil</h1>
                <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-700">Informations Personnelles</h2>
                    <div className="mt-2">
                        <label>Prénom:</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="mt-2">
                        <label>Nom:</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div className="mt-2">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={userInfo.email}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                        />
                    </div>
                    <button
                        onClick={handleSaveProfile}
                        className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Enregistrer les Modifications
                    </button>
                </div>
                <div className="mt-4">
                    <h2 className="text-xl font-semibold text-gray-700">Changer l'Email</h2>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    <button
                        onClick={handleChangeEmail}
                        className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Envoyer l'Email de Vérification
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profil;
