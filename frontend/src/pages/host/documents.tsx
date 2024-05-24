// pages/host/documents.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

const Documents = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier à télécharger.');
      return;
    }

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Document téléchargé avec succès.');
      } else {
        alert('Erreur lors du téléchargement du document.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors du téléchargement du document.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              Télécharger un document *
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Télécharger</button>
        </form>
      </div>
    </div>
  );
};

export default Documents;
