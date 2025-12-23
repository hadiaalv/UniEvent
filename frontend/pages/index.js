import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-32 space-y-8">
        <h1 className="text-6xl sm:text-7xl font-extrabold text-primary animate-bounce drop-shadow-lg">UniEvent</h1>
        <p className="text-lg sm:text-2xl text-accent font-semibold animate-fade-in text-center drop-shadow bg-white/40 px-6 py-3 rounded-xl">
          All university events in one <span className="underline decoration-accent">animated</span>, vibrant campus hub.
        </p>
        <div className="mt-8 animate-fade-in flex space-x-5">
          <a href="/events" className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-full shadow-lg font-bold transition-colors duration-200">View Events</a>
          <a href="/login" className="bg-accent hover:bg-primary text-white px-6 py-2 rounded-full shadow-lg font-bold transition-colors duration-200">Login</a>
        </div>
      </main>
    </div>
  );
}
