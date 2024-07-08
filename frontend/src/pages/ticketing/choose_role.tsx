import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const ChooseRole: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const token = Cookie.get('token');
        if (token) {
            // Si l'utilisateur est déjà connecté, redirigez-le vers la page de création de tickets
            router.push('/ticketing/ticketing_portal');
        }
    }, [router]);

    const handleRoleSelection = (role: string) => {
        switch (role) {
            case 'admin':
            case 'renter':
                router.push('/login');
                break;
            case 'host':
                router.push('/host/login');
                break;
            case 'contractor':
                router.push('/contractor/login');
                break;
            default:
                break;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold text-center">Choisissez Votre Rôle</h1>
                <div className="space-y-4">
                    <button
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleRoleSelection('admin')}
                    >
                        Admin
                    </button>
                    <button
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleRoleSelection('renter')}
                    >
                        Renter
                    </button>
                    <button
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleRoleSelection('host')}
                    >
                        Host
                    </button>
                    <button
                        className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => handleRoleSelection('contractor')}
                    >
                        Contractor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChooseRole;
