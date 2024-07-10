import React, { useState, ChangeEvent, FormEvent } from 'react';
import Cookie from 'js-cookie';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimulationModal: React.FC<SimulationModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    conciergeService: '',
    propertyAddress: '',
    propertyCountry: '',
    propertyType: '',
    rentalType: '',
    numBedrooms: '',
    guestCapacity: '',
    surfaceArea: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactTime: '',
    acceptPrivacy: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookie.get('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/host/simulation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Simulation Successful', data);
        alert(`Prix estimé: ${data.estimatedPrice} €`);
        onClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Simulation Error:', error);
      alert('Une erreur s’est produite lors de la simulation.');
    }
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Je fais une demande de simulation personnalisée</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Quel type de conciergerie souhaitez-vous ? *</label>
              <select
                  name="conciergeService"
                  value={formData.conciergeService}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Gestion de A à Z">Gestion de A à Z</option>
                <option value="Web Management">Web Management</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Adresse de votre propriété en location courte durée *</label>
              <input
                  type="text"
                  name="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Pays de votre propriété en location courte durée *</label>
              <select
                  name="propertyCountry"
                  value={formData.propertyCountry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Type de bien *</label>
              <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Appartement">Appartement</option>
                <option value="Maison">Maison</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Type de location *</label>
              <select
                  name="rentalType"
                  value={formData.rentalType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Logement complet">Logement complet</option>
                <option value="Chambre privée">Chambre privée</option>
                <option value="Chambre partagée">Chambre partagée</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre de chambres *</label>
              <select
                  name="numBedrooms"
                  value={formData.numBedrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Capacit&eacute; d&apos;accueil *</label>
              <select
                  name="guestCapacity"
                  value={formData.guestCapacity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Surface en m² *</label>
              <input
                  type="text"
                  name="surfaceArea"
                  value={formData.surfaceArea}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nom & prénom *</label>
              <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">E-mail *</label>
              <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Téléphone *</label>
              <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">À quelle heure souhaitez-vous être contacté ? *</label>
              <select
                  name="contactTime"
                  value={formData.contactTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
              >
                <option value="">Sélectionner</option>
                <option value="Matin">Matin</option>
                <option value="Après-midi">Après-midi</option>
                <option value="Soir">Soir</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                <input
                    type="checkbox"
                    name="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onChange={handleChange}
                    className="mr-2 leading-tight"
                />
                J&apos;accepte
              </label>
            </div>
            <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" type="submit">
              Recevoir mon étude de rentabilité
            </button>
          </form>
        </div>
      </div>
  );
};

export default SimulationModal;
