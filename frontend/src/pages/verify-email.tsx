import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const VerifyEmail = () => {
    const router = useRouter();
    const { token } = router.query;
    const [message, setMessage] = useState('Vérification en cours...');

    const verifyEmail = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email?token=${token}`);
            const data = await response.text();

            if (response.status === 200) {
                setMessage('Email vérifié avec succès.');
            } else {
                setMessage(data || 'Erreur lors de la vérification de l&apos;email.');
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de l&apos;email:', error);
            setMessage('Erreur interne du serveur.');
        }
    };

    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token, verifyEmail]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
                <h1 className="text-2xl font-bold text-center">{message}</h1>
            </div>
        </div>
    );
};

export default VerifyEmail;
