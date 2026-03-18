import './globals.css';
import Navbar from '../src/components/layout/Navbar';
import Footer from '../src/components/layout/Footer';
import ScrollToTop from '../src/components/ui/ScrollToTop';
import { AuthProvider } from '../src/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

export const viewport = {
  themeColor: '#FF5C00',
};

export const metadata = {
  title: 'Easy Ride Autos | Easiest means to your desired vehicle',
  description: 'Premium vehicle imports from the US to Nigeria. We handle the purchase, shipping, and professional repairs with full transparency.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid #333',
            },
          }} 
        />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <ScrollToTop />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
