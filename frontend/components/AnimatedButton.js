export default function AnimatedButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg transition transform duration-200 hover:scale-110 shadow-lg animate-pulse"
    >
      {children}
    </button>
  );
}