// pages/host/documents.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

interface Property {
  id: string;
  title: string;
}

interface Document {
  id: string;
  document_type: string;
  file_path: string;
}

const Documents: React.FC = () => {
  const [selectedPersonalFiles, setSelectedPersonalFiles] = useState<{ [key: string]: File | null }>({});
  const [selectedPropertyFiles, setSelectedPropertyFiles] = useState<{ [key: string]: File | null }>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [personalDocuments, setPersonalDocuments] = useState<Document[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<Document[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = Cookie.get('token');
    if (token) {
      fetchProperties(token);
      fetchPersonalDocuments(token);
    } else {
      router.push('/host/login');
    }
  }, [router]);

  const fetchProperties = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchPersonalDocuments = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/document/personal-documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPersonalDocuments(data);
    } catch (error) {
      console.error('Error fetching personal documents:', error);
    }
  };

  const fetchPropertyDocuments = async (token: string, propertyId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/document/property-documents/${propertyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPropertyDocuments(data);
    } catch (error) {
      console.error('Error fetching property documents:', error);
    }
  };

  const handlePersonalFileChange = (event: ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedPersonalFiles((prevFiles) => ({
        ...prevFiles,
        [documentType]: event.target.files[0],
      }));
    }
  };

  const handlePropertyFileChange = (event: ChangeEvent<HTMLInputElement>, documentType: string) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedPropertyFiles((prevFiles) => ({
        ...prevFiles,
        [documentType]: event.target.files[0],
      }));
    }
  };

  const handlePersonalSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    const formData = new FormData();
    for (const [documentType, file] of Object.entries(selectedPersonalFiles)) {
      if (file) {
        formData.append(documentType, file);
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/document/personal-documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Documents personnels téléchargés avec succès.');
        fetchPersonalDocuments(token);
      } else {
        alert('Erreur lors du téléchargement des documents personnels.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors du téléchargement des documents personnels.');
    }
  };

  const handlePropertySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedProperty) {
      alert('Veuillez sélectionner une propriété.');
      return;
    }

    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
      return;
    }

    const formData = new FormData();
    formData.append('property_id', selectedProperty);

    for (const [documentType, file] of Object.entries(selectedPropertyFiles)) {
      if (file) {
        formData.append(documentType, file);
      }
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/document/property-documents`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Documents de la propriété téléchargés avec succès.');
        fetchPropertyDocuments(token, selectedProperty);
      } else {
        alert('Erreur lors du téléchargement des documents de la propriété.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors du téléchargement des documents de la propriété.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold">Documents Personnels</h2>
        <form onSubmit={handlePersonalSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identity_document">
              Pièce d'identité *
            </label>
            <input
              type="file"
              id="identity_document"
              onChange={(e) => handlePersonalFileChange(e, 'identity_document')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="residence_proof">
              Justificatif de domicile *
            </label>
            <input
              type="file"
              id="residence_proof"
              onChange={(e) => handlePersonalFileChange(e, 'residence_proof')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Télécharger</button>
        </form>
        <h3 className="text-xl font-semibold mt-8">Documents Personnels Transmis</h3>
        <ul>
          {Array.isArray(personalDocuments) && personalDocuments.map((doc) => (
            <li key={doc.id} className="mb-2">
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${doc.file_path}`} target="_blank" rel="noopener noreferrer">
                {doc.document_type}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-semibold">Documents de Propriété</h2>
        <form onSubmit={handlePropertySubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="propertySelect">
              Sélectionner une propriété *
            </label>
            <select
              id="propertySelect"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Sélectionner une propriété</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>{property.title}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property_title">
              Titre de propriété *
            </label>
            <input
              type="file"
              id="property_title"
              onChange={(e) => handlePropertyFileChange(e, 'property_title')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dpe">
              Diagnostic de performance énergétique (DPE) *
            </label>
            <input
              type="file"
              id="dpe"
              onChange={(e) => handlePropertyFileChange(e, 'dpe')}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {/* Ajoutez d'autres champs de documents ici */}
          <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">Télécharger</button>
        </form>
        <h3 className="text-xl font-semibold mt-8">Documents de Propriété Transmis</h3>
        <ul>
          {Array.isArray(propertyDocuments) && propertyDocuments.map((doc) => (
            <li key={doc.id} className="mb-2">
              <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${doc.file_path}`} target="_blank" rel="noopener noreferrer">
                {doc.document_type}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Documents;
