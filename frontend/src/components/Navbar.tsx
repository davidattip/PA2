import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaBars } from 'react-icons/fa'; 
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/">
                <div className="flex items-center py-4 px-2 cursor-pointer">
                  <Image src="/logo_pcs.png" alt="Logo" width={90} height={45} />
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              {/* Links for larger screens */}
              <Link href="/logements">
                <span className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300 cursor-pointer">Logements</span>
              </Link>
              <Link href="/experiences">
                <span className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300 cursor-pointer">Expériences</span>
              </Link>
              <Link href="/online-experiences">
                <span className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300 cursor-pointer">Expériences en ligne</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/host">
              <span className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer">Mettre mon logement sur PCS</span>
            </Link>
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <FaUserCircle className="text-gray-800 h-8 w-8" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50">
                  <Link href="/signup">
                    <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Inscription</span>
                  </Link>
                  <Link href="/login">
                    <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Connexion</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 md:hidden"
          >
            <FaBars className="text-gray-800 h-6 w-6" />
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          {/* Mobile menu */}
          <Link href="/logements">
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Logements</span>
          </Link>
          <Link href="/experiences">
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Expériences</span>
          </Link>
          <Link href="/online-experiences">
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Expériences en ligne</span>
          </Link>
          <Link href="/host">
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Mettre mon logement sur PCS</span>
          </Link>
          <Link href="/signup">
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Inscription</span>
          </Link>
          <Link href="/login">
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Connexion</span>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
