import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const PropertyDetail = () => {
  const [property, setProperty] = useState<any>(null);
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [endDateMax, setEndDateMax] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/public/properties/${id}`);
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
      const token = Cookie.get('token');
      if (!token) {
        console.error('No token found');
        return;
      }

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

    const fetchServices = async () => {
      const token = Cookie.get('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/service-types`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Filtrer les services pour n'afficher que ceux destinés aux locataires (renter)
          const renterServices = data.filter((service: any) => service.targetUser === 'renter');
          setServices(renterServices);
        } else {
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchProperty();
    fetchAvailabilities();
    fetchServices();
  }, [id]);

  const handleBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookie.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (!startDate || !endDate) {
      alert('Veuillez sélectionner des dates de début et de fin.');
      return;
    }

    const selectedStartDate = new Date(startDate);
    const selectedEndDate = new Date(endDate);

    const isWithinAvailabilities = availabilities.some(availability => {
      const availabilityStartDate = new Date(availability.start_date);
      const availabilityEndDate = new Date(availability.end_date);
      return (
        selectedStartDate >= availabilityStartDate &&
        selectedEndDate <= availabilityEndDate
      );
    });

    if (!isWithinAvailabilities) {
      alert('Les dates sélectionnées ne sont pas disponibles.');
      return;
    }

    const formattedStartDate = selectedStartDate.toISOString();
    const formattedEndDate = selectedEndDate.toISOString();
    const calculatedTotalPrice = property.price_per_night * ((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 3600 * 24));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/property/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          property_id: id,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          total_price: calculatedTotalPrice,
          services: selectedServices
        }),
      });

      if (response.ok) {
        alert('Réservation effectuée avec succès!');
      } else if (response.status === 409) {
        setErrorMessage('Les dates sélectionnées se chevauchent avec une réservation existante.');
      } else {
        alert('Erreur lors de la réservation.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur s’est produite lors de la réservation.');
    }
  };

  useEffect(() => {
    if (startDate) {
      const selectedStartDate = new Date(startDate);
      const availability = availabilities.find(availability => {
        const availabilityStartDate = new Date(availability.start_date);
        const availabilityEndDate = new Date(availability.end_date);
        return (
          selectedStartDate >= availabilityStartDate &&
          selectedStartDate <= availabilityEndDate
        );
      });
      if (availability) {
        setEndDateMax(new Date(availability.end_date).toISOString().split('T')[0]);
      }
    } else {
      setEndDateMax('');
    }
  }, [startDate, availabilities]);

  const handleServiceChange = (serviceId: number) => {
    setSelectedServices(prevSelectedServices =>
      prevSelectedServices.includes(serviceId)
        ? prevSelectedServices.filter(id => id !== serviceId)
        : [...prevSelectedServices, serviceId]
    );
  };

  if (!property) {
    return <p>Chargement...</p>;
  }

  const events = availabilities.map((availability) => ({
    id: availability.id,
    title: '',  // Empty title to hide the text
    start: new Date(availability.start_date),
    end: new Date(availability.end_date),
    allDay: true,
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-700">{property.title}</h1>
      <p>{property.description}</p>
      <p>Lieu: {property.location}</p>
      <p>Prix par nuit: {property.price_per_night} €</p>
      <div className="photos-grid">
        {property.photos && property.photos.split(',').map((photo: string, index: number) => (
          <div key={index} className="photo-container">
            <img
              crossOrigin="anonymous"
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${photo}`}
              alt={`Photo de ${property.title}`}
              className="property-image mt-2 w-full h-auto"
            />
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-4">Disponibilités</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />

      <div className="mt-4">
        <div className="border p-4 rounded-lg shadow-lg">
          <div className="text-xl font-bold">
            <span className="line-through">414 €</span> 313 € par nuit
          </div>
          <form onSubmit={handleBooking}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Arrivée</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={startDate}
                  min={new Date().toISOString().split('T')[0]}  // Minimum date is today
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label>Départ</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded"
                  value={endDate}
                  min={startDate || new Date().toISOString().split('T')[0]}  // Minimum date is start date or today
                  max={endDateMax}  // Maximum date is the end of the availability period
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            <div className="mt-4">
              <label>Voyageurs</label>
              <select className="w-full border px-3 py-2 rounded">
                <option>1 voyageur</option>
                <option>2 voyageurs</option>
                <option>3 voyageurs</option>
                <option>4 voyageurs</option>
              </select>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Sélectionnez des services supplémentaires :</h3>
              <ul className="mt-2">
                {services.map(service => (
                  <li key={service.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`service-${service.id}`}
                      value={service.id}
                      onChange={() => handleServiceChange(service.id)}
                      className="mr-2"
                    />
                    <label htmlFor={`service-${service.id}`}>{service.name} - {service.price} €</label>
                  </li>
                ))}
              </ul>
            </div>
            <button className="w-full mt-4 bg-pink-500 text-white py-2 rounded">Réserver</button>
          </form>
          <div className="mt-4">
            <p className="text-gray-500">Aucun montant ne vous sera débité pour le moment</p>
            <div className="flex justify-between">
              <span>{property.price_per_night} € x {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24))} nuits</span>
              <span>{totalPrice} €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de ménage</span>
              <span>92 €</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de service PCS</span>
              <span>304 €</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>365 €</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{totalPrice + 92 + 304 + 365} €</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .property-image {
          width: 100%;
          height: auto;
          max-width: 400px;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .photos-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .photo-container {
          flex: 1 1 calc(33.333% - 16px);
          max-width: calc(33.333% - 16px);
        }
      `}</style>
    </div>
  );
};

export default PropertyDetail;
