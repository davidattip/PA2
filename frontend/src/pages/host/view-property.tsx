import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr.js';
import 'flatpickr/dist/flatpickr.min.css';

const localizer = momentLocalizer(moment);

interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  photos: string;
}

interface Availability {
  id: number;
  start_date: string;
  end_date: string;
  total_price: number;
}

interface CustomEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

const ViewProperty: React.FC = () => {
  const [property, setProperty] = useState<Property | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CustomEvent | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id } = router.query;

  Modal.setAppElement('#__next');

  useEffect(() => {
    const token = Cookie.get('token');
    if (!token) {
      router.push('/host/login');
    } else if (id) {
      const fetchProperty = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProperty(data);
          } else {
            console.error('Failed to fetch property details');
          }
        } catch (error) {
          console.error('Error fetching property details:', error);
        }
      };

      const fetchAvailabilities = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/properties/${id}/availabilities`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setAvailabilities(data);
          } else {
            console.error('Failed to fetch availabilities');
          }
        } catch (error) {
          console.error('Error fetching availabilities:', error);
        }
      };

      fetchProperty();
      fetchAvailabilities();
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (selectedEvent) {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availabilities/${selectedEvent.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setAvailabilities(availabilities.filter(a => a.id !== selectedEvent.id));
          closeModal();
        } else {
          alert('Erreur lors de la suppression de la disponibilité.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Une erreur s’est produite lors de la suppression de la disponibilité.');
      }
    }
  };

  const openModal = (event: CustomEvent) => {
    setSelectedEvent(event);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  const handleSave = async () => {
    if (selectedEvent) {
      const token = Cookie.get('token');
      if (!token) {
        router.push('/host/login');
        return;
      }

      const startDate = startDateRef.current?.value;
      const endDate = endDateRef.current?.value;

      if (!startDate || !endDate) {
        alert('Veuillez sélectionner des dates de début et de fin.');
        return;
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        alert('Veuillez sélectionner des dates valides.');
        return;
      }

      const today = new Date();
      if (parsedStartDate < today) {
        alert('La date de début ne peut pas être antérieure à la date du jour.');
        return;
      }

      if (parsedEndDate < parsedStartDate) {
        alert('La date de fin ne peut pas être antérieure à la date de début.');
        return;
      }

      const isConflict = availabilities.some(availability => {
        if (availability.id === selectedEvent.id) return false;
        const existingStartDate = new Date(availability.start_date);
        const existingEndDate = new Date(availability.end_date);
        return (parsedStartDate <= existingEndDate && parsedEndDate >= existingStartDate);
      });

      if (isConflict) {
        alert('Les dates sélectionnées se chevauchent avec des disponibilités existantes.');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/availabilities/${selectedEvent.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ start_date: startDate, end_date: endDate }),
        });

        if (response.ok) {
          setAvailabilities(availabilities.map(a => a.id === selectedEvent.id ? { ...a, start_date: startDate, end_date: endDate } : a));
          closeModal();
        } else {
          alert('Erreur lors de la mise à jour de la disponibilité.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Une erreur s’est produite lors de la mise à jour de la disponibilité.');
      }
    }
  };

  useEffect(() => {
    if (modalIsOpen) {
      setTimeout(() => {
        flatpickr(startDateRef.current!, {
          locale: French,
          dateFormat: "Y-m-d",
          minDate: "today",
          defaultDate: selectedEvent?.start,
          onChange: (selectedDates) => {
            const selectedStartDate = selectedDates[0];
            if (selectedStartDate) {
              (endDateRef.current as any)._flatpickr.set('minDate', selectedStartDate);
            }
          }
        });

        flatpickr(endDateRef.current!, {
          locale: French,
          dateFormat: "Y-m-d",
          minDate: "today",
          defaultDate: selectedEvent?.end
        });
      }, 0);
    }
  }, [modalIsOpen, selectedEvent]);

  if (!property) {
    return <p>Chargement...</p>;
  }

  const events: CustomEvent[] = availabilities.map(availability => ({
    id: availability.id,
    title: '',  // Empty title to hide the text
    start: new Date(availability.start_date),
    end: new Date(availability.end_date),
    allDay: true,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{property.title}</h1>
      <p className="text-gray-700 mb-2">{property.description}</p>
      <p className="text-gray-700 mb-2">Lieu: {property.location}</p>
      <p className="text-gray-700 mb-2">Prix par nuit: {property.price_per_night} €</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {property.photos && property.photos.split(',').map((photo: string, index: number) => (
          <img
            crossOrigin="anonymous"
            key={index}
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
            alt={`Photo de ${property.title}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ))}
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded mt-4"
        onClick={() => router.push(`/host/add-availability?propertyId=${property.id}`)}
      >
        Ajouter une disponibilité
      </button>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disponibilités</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor={(event: CustomEvent) => new Date(event.start)}
          endAccessor={(event: CustomEvent) => new Date(event.end)}
          style={{ height: 500 }}
          onSelectEvent={openModal}
          eventPropGetter={() => ({
            style: {
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              display: 'block',
              width: '100%',
              height: '100%',
              position: 'relative',
            },
          })}
        />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Modifier la disponibilité"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 1000,
            },
            content: {
              maxWidth: '500px',
              margin: 'auto',
              padding: '20px',
              borderRadius: '8px',
              zIndex: 1001,
            },
          }}
        >
          <h2>Modifier la disponibilité</h2>
          <label>
            Date de début:
            <input
              type="text"
              ref={startDateRef}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <label className="mt-4">
            Date de fin:
            <input
              type="text"
              ref={endDateRef}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
            />
          </label>
          <div className="mt-6 flex justify-between">
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded"
            >
              Supprimer
            </button>
            <div>
              <button
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded mr-2"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ViewProperty;
