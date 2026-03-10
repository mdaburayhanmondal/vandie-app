import '@/app/globals.css';
import Navbar from '@/components/Navbar';
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          <header className="max-w-7xl mx-auto p-4">
            <Navbar />
          </header>
          <main className="min-h-screen max-w-7xl mx-auto p-4">{children}</main>
          <footer className="max-w-7xl mx-auto">Footer</footer>
        </body>
      </ClerkProvider>
    </html>
  );
}
