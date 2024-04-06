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
              <Link href="/" passHref>
                <a className="flex items-center py-4 px-2">
                  <Image src="/logo_pcs.png" alt="Logo" width={90} height={45} />
                  <span className="font-semibold text-gray-500 text-lg">PCS</span>
                </a>
              </Link>
            </div>
            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/logements" passHref>
                <a className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">Logements</a>
              </Link>
              <Link href="/experiences" passHref>
                <a className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">Expériences</a>
              </Link>
              <Link href="/online-experiences" passHref>
                <a className="py-4 px-2 text-gray-500 font-semibold hover:text-red-500 transition duration-300">Expériences en ligne</a>
              </Link>
            </div>
          </div>
          {/* Secondary Navbar items */}
          <div className="hidden md:flex items-center space-x-3 ">
            <Link href="/host" passHref>
              <a className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-red-500 hover:text-white transition duration-300">Mettre mon logement sur PCS</a>
            </Link>
          </div>
          {/* Mobile menu button */}
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
