import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaBars } from 'react-icons/fa'; 

const Navbar = () => {
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
             {/* Icône de profil - déclencheur de l'interface de connexion */}
        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <FaUserCircle className="text-gray-800 h-8 w-8" />
        </button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          <FaBars className="text-gray-800 h-6 w-6" />
        </button>
      </div>
          {/* Your existing button code */}
        </div>
      </div>
      {/* mobile menu */}
      <div className="hidden mobile-menu">
        <ul className="">
          <li className="active"><a href="index.html" className="block text-sm px-2 py-4 text-white bg-green-500 font-semibold">Home</a></li>
          <li><a href="#services" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Services</a></li>
          <li><a href="#about" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">About</a></li>
          <li><a href="#contact" className="block text-sm px-2 py-4 hover:bg-green-500 transition duration-300">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
