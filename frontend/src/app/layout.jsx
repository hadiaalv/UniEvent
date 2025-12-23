import "./../styles/globals.css";

export const metadata = {
  title: "UniEvent",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-blue-600 text-white p-4 font-bold">
          UniEvent
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
