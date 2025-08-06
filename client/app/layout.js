import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers'; // ✅ this is the fix
// import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hotel Information System',
  description: 'Find and book the best hotels worldwide',
};

export default function RootLayout({ children }) {
  return (
   <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
              <Toaster richColors position="top-right" />
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
