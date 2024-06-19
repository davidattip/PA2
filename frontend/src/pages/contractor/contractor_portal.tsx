// pages/contractorPortal.tsx
import React from 'react';
import Link from 'next/link';

const ContractorPortal: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-semibold mb-8 text-center">Bienvenue sur le Portail des Prestataires</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section pour la connexion */}
                <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition duration-300">
                    <h2 className="text-2xl font-bold mb-4">Connexion</h2>
                    <p className="mb-4">Déjà un prestataire ? Connectez vous ici.</p>
                    <Link href="/contractor/login" className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                            Connexion
                    </Link>
                </div>
                {/* Section pour l'inscription */}
                <div className="bg-white shadow-lg rounded-lg p-8 hover:shadow-xl transition duration-300">
                    <h2 className="text-2xl font-bold mb-4">Devenir un prestataire PCS </h2>
                    <p className="mb-4">Rejoignez notre réseau de prestataire. Inscrivez vous ici.</p>
                    <Link href="/contractor/register" className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
                            Inscription
                    </Link>
                </div>
            </div>
        </div>
    );
};

{/*La redirection après une connexion réussie utilise router.push('/contractor/dashboard') au lieu de '/host/dashboard'.*/}

export default ContractorPortal;
