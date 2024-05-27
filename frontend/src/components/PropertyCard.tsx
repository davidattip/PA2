// components/PropertyCard.tsx
import React from 'react';

interface PropertyCardProps {
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  totalPrice: number;
  host: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  stayPeriod: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  title,
  description,
  location,
  pricePerNight,
  totalPrice,
  host,
  rating,
  reviewsCount,
  imageUrl,
  stayPeriod,
}) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <img className="w-full" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
        <p className="text-gray-700 text-base">{location}</p>
        <p className="text-gray-700 text-base">Hôte : {host}</p>
        <p className="text-gray-700 text-base">{stayPeriod}</p>
        <div className="flex items-center mt-2">
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.168c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.959c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.84-.197-1.54-1.118l1.287-3.959a1 1 0 00-.364-1.118L2.045 9.386c-.784-.57-.38-1.81.588-1.81h4.168a1 1 0 00.95-.69l1.286-3.959z" />
          </svg>
          <span className="text-gray-700 ml-2">{rating} ({reviewsCount})</span>
        </div>
        <p className="text-gray-700 text-base mt-2">{pricePerNight} € par nuit · {totalPrice} € au total</p>
      </div>
    </div>
  );
};

export default PropertyCard;
