import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaBars } from 'react-icons/fa'; 
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {/* Website Logo */}
              <Link href="/" passHref className="flex items-center py-4 px-2">

                <Image src="/logo_pcs.png" alt="Logo" width={90} height={45} />
                

              </Link>
            </div>
            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                href="/logements"
                passHref
                className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">
                Logements
              </Link>
              <Link
                href="/experiences"
                passHref
                className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">
                Expériences
              </Link>
              <Link
                href="/online-experiences"
                passHref
                className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">
                Expériences en ligne
              </Link>
            </div>
          </div>
          {/* Secondary Navbar items */}
          <div className="hidden md:flex items-center space-x-3 ">
            <Link
              href="/host"
              passHref
              className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300">
              Mettre mon logement sur PCS
            </Link>
            <div className="relative">  {/* Ajout de la position relative */}
             {/* Icône de profil - déclencheur de l'interface de connexion */}
             <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                aria-haspopup="true"  // Pour l'accessibilité
                aria-expanded={isMenuOpen}  // Pour l'accessibilité
              >
              <FaUserCircle className="text-gray-800 h-8 w-8" />
            </button>
             {/* Menu déroulant */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50">
                <Link href="/signup"
                  passHref
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Inscription
                </Link>
                <Link href="/login"
                  passHref
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Connexion
                </Link>
                {/* Ajouter d'autres liens ici si nécessaire */}
              </div>
            )}
            <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <FaBars className="text-gray-800 h-6 w-6" />
            </button>
            </div>
          </div>
        </div>
      </div>
     
    </nav>
  );
};

export default Navbar;
