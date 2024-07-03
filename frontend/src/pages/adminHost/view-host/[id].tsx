import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

type Host = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  banned: boolean;
};

type Document = {
  id: number;
  document_type: string;
  file_path: string;
  is_valid: boolean | null;
  property_id?: number | null;
};

type Property = {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  subscribed: boolean;
};

const ViewHost = () => {
  const [host, setHost] = useState<Host>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    banned: false,
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchHost(id as string);
      fetchDocuments(id as string);
      fetchProperties(id as string);
    }
  }, [id]);

  const fetchHost = async (hostId: string) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts/${hostId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHost(data);
    } catch (error) {
      console.error('Failed to fetch host:', error);
    }
  };

  const fetchDocuments = async (hostId: string) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts/${hostId}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const fetchProperties = async (hostId: string) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hosts/backoffice/hosts/${hostId}/properties`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  const validateDocument = async (documentId: number, isValid: boolean) => {
    try {
      const token = Cookie.get('token');
      if (!token) {
        console.error('Token is not available');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/document/personal-documents/${documentId}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_valid: isValid })
      });

      if (!response.ok) {
        throw new Error(`Failed to validate document: ${response.status}`);
      }

      const updatedDocument = await response.json();
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) => (doc.id === updatedDocument.document.id ? updatedDocument.document : doc))
      );
    } catch (error) {
      console.error('Failed to validate document:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">Host Details</h1>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Host Information</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="mb-2"><strong>First Name:</strong> {host.first_name}</p>
            <p className="mb-2"><strong>Last Name:</strong> {host.last_name}</p>
            <p className="mb-2"><strong>Email:</strong> {host.email}</p>
            <p className="mb-2"><strong>Banned:</strong> {host.banned ? 'Yes' : 'No'}</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Documents</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {documents.length === 0 ? (
              <p>No documents available.</p>
            ) : (
              documents.map((document) => (
                <div key={document.id} className="mb-2">
                  <p>
                    <strong>{document.document_type}:</strong> <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${document.file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Document</a>
                    {document.property_id && (
                      <span className="ml-2 text-gray-500">({properties.find(p => p.id === document.property_id)?.title})</span>
                    )}
                  </p>
                  <div className="flex space-x-2 mt-1">
                    <button
                      className={`px-3 py-1 text-sm rounded ${document.is_valid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => validateDocument(document.id, true)}
                      disabled={document.is_valid === true}
                    >
                      Valid
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded ${document.is_valid === false ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => validateDocument(document.id, false)}
                      disabled={document.is_valid === false}
                    >
                      Invalid
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3">Properties</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            {properties.length === 0 ? (
              <p>No properties available.</p>
            ) : (
              properties.map((property) => (
                <div key={property.id} className="mb-4">
                  <p className="mb-2"><strong>Title:</strong> {property.title}</p>
                  <p className="mb-2"><strong>Description:</strong> {property.description}</p>
                  <p className="mb-2"><strong>Location:</strong> {property.location}</p>
                  <p className="mb-2"><strong>Price per night:</strong> {property.price_per_night}</p>
                  <p className="mb-2"><strong>Subscribed:</strong> {property.subscribed ? 'Yes' : 'No'}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHost;
