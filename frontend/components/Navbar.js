import { getUserFromToken, removeToken } from "../lib/auth";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Navbar() {
  const user = typeof window !== "undefined" ? getUserFromToken() : null;
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center p-4 bg-primary shadow animate-fade-in">
      <Link legacyBehavior href="/">
        <a className="text-accent font-extrabold text-2xl tracking-widest cursor-pointer drop-shadow">UniEvent</a>
      </Link>
      <div className="flex items-center gap-6">
        <Link legacyBehavior href="/events">
          <a className="hover:text-accent font-semibold transition">Events</a>
        </Link>
        {user?.role === "admin" && (
          <Link legacyBehavior href="/admin/events">
            <a className="hover:text-accent font-semibold transition">My Events</a>
          </Link>
        )}
        {user?.role === "superadmin" && (
          <Link legacyBehavior href="/superadmin/events">
            <a className="hover:text-accent font-semibold transition">Moderate Events</a>
          </Link>
        )}
        <Link legacyBehavior href="/notifications">
          <a className="hover:text-accent font-semibold transition">Notifications</a>
        </Link>
        {!user && (
          <Link legacyBehavior href="/login">
            <a className="ml-2 bg-accent text-white px-4 py-1 rounded-full font-bold shadow hover:bg-white hover:text-accent transition duration-200">Login</a>
          </Link>
        )}
        {user && (
          <button
            className="ml-2 bg-white text-primary px-4 py-1 rounded-full font-bold shadow hover:bg-accent hover:text-white transition duration-200"
            onClick={() => { removeToken(); router.push("/login"); }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
