// components/SearchBar.tsx
import React from 'react';

const SearchBar = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white shadow-md rounded-full p-2 flex items-center">
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Destination</div>
          <input 
            type="text" 
            placeholder="Rechercher une destination" 
            className="w-full outline-none text-gray-700" 
          />
        </div>
        <div className="border-l h-8"></div>
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Arrivée</div>
          <input 
            type="text" 
            placeholder="Quand ?" 
            className="w-full outline-none text-gray-700" 
          />
        </div>
        <div className="border-l h-8"></div>
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Départ</div>
          <input 
            type="text" 
            placeholder="Quand ?" 
            className="w-full outline-none text-gray-700" 
          />
        </div>
        <div className="border-l h-8"></div>
        <div className="flex-1 px-4 py-2">
          <div className="text-xs font-semibold text-gray-600">Voyageurs</div>
          <input 
            type="text" 
            placeholder="Ajouter des voyageurs" 
            className="w-full outline-none text-gray-700" 
          />
        </div>
        <button className="bg-pink-500 text-white p-2 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
