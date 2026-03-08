import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <header className="p-4 max-w-7xl mx-auto">
        <Navbar />
      </header>
      <main className="min-h-screen max-w-7xl mx-auto">Main</main>
      <footer>Footer</footer>
    </>
  );
}
