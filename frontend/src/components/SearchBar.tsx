// components/SearchBar.tsx
import React, { useState, useRef, useEffect } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { French } from 'flatpickr/dist/l10n/fr.js';

interface SearchBarProps {
  onSearch: (criteria: { destination: string; arrival: string; departure: string; guests: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [guests, setGuests] = useState('');
  const arrivalRef = useRef<HTMLInputElement>(null);
  const departureRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (arrivalRef.current && departureRef.current) {
      flatpickr(arrivalRef.current, {
        locale: French,
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: (selectedDates, dateStr) => {
          if (selectedDates.length > 0) {
            flatpickr(departureRef.current!, {
              locale: French,
              dateFormat: "Y-m-d",
              minDate: dateStr,
            });
          }
        },
      });
      flatpickr(departureRef.current, {
        locale: French,
        dateFormat: "Y-m-d",
        minDate: "today",
      });
    }
  }, []);

  const handleSearch = () => {
    const arrival = arrivalRef.current ? arrivalRef.current.value : '';
    const departure = departureRef.current ? departureRef.current.value : '';
    onSearch({ destination, arrival, departure, guests });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-md rounded-full p-2 flex items-center">
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Destination</div>
          <input 
            type="text" 
            placeholder="Rechercher une destination" 
            className="w-full outline-none text-gray-700" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div className="border-l h-8"></div>
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Arrivée</div>
          <input 
            type="text" 
            placeholder="Quand ?" 
            className="w-full outline-none text-gray-700" 
            ref={arrivalRef}
          />
        </div>
        <div className="border-l h-8"></div>
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Départ</div>
          <input 
            type="text" 
            placeholder="Quand ?" 
            className="w-full outline-none text-gray-700" 
            ref={departureRef}
          />
        </div>
        <div className="border-l h-8"></div>
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Voyageurs</div>
          <input 
            type="text" 
            placeholder="Ajouter des voyageurs" 
            className="w-full outline-none text-gray-700" 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
        <button className="bg-pink-500 text-white p-2 rounded-full" onClick={handleSearch}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
