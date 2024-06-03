import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white shadow-lg mt-10">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex justify-between">
                    <p className="text-gray-600">&copy; 2023 Paris Caretaker Services</p>
                    <Link href="/contractors">
                        <a className="text-gray-600 hover:text-red-500 transition duration-300">Portal for Contractors</a>
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
