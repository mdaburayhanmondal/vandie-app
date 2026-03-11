import '@/app/globals.css';
import FloatingCart from '@/components/FloatingCart';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/contexts/cartContext';
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <CartProvider>
          <body>
            <header className="max-w-7xl mx-auto p-4">
              <Navbar />
            </header>
            <main className="min-h-screen max-w-7xl mx-auto p-4">
              {children}
            </main>
            <FloatingCart />
            <footer className="max-w-7xl mx-auto">Footer</footer>
          </body>
        </CartProvider>
      </ClerkProvider>
    </html>
  );
}
