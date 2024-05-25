// src/pages/_app.tsx
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import HostNavbar from '../components/HostNavbar';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Définir les chemins pour lesquels le HostNavbar doit être utilisé
  const hostRoutes = [
    '/host/login',
    '/host/register',
    '/host/dashboard',
    '/host/properties',
    '/host/documents',
    '/host/notifications',
    '/host/add-property'
  ];

  const isHostRoute = hostRoutes.includes(router.pathname);

  return (
    <>
      {isHostRoute ? <HostNavbar /> : <Navbar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
