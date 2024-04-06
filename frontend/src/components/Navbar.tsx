import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {/* Website Logo */}
              <a href="#" className="flex items-center py-4 px-2">
                <Image src="/logo_pcs.png" alt="Logo" width={90} height={45} />
                <span className="font-semibold text-gray-500 text-lg">airbnb</span>
              </a>
            </div>
            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/logements"><a className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">Logements</a></Link>
              <Link href="/experiences"><a className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">Expériences</a></Link>
              <Link href="/online-experiences"><a className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">Expériences en ligne</a></Link>
            </div>
          </div>
          {/* Secondary Navbar items */}
          <div className="hidden md:flex items-center space-x-3 ">
            <Link href="/host"><a className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300">Mettre mon logement sur Airbnb</a></Link>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="outline-none mobile-menu-button">
              <svg className=" w-6 h-6 text-gray-500 hover:text-red-500 "
                x-show="!showMenu"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
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
