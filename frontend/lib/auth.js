import jwtDecode from "jwt-decode";

// Save JWT token to localStorage
export const saveToken = (token) => localStorage.setItem("token", token);

// Retrieve token from localStorage
export const getToken = () => localStorage.getItem("token");

// Remove token from localStorage
export const removeToken = () => localStorage.removeItem("token");

export const getUserFromToken = () => {
  if (typeof window === "undefined") return null;  // Prevent SSR issues
  const t = getToken();
  if (!t) return null;
  try {
    return jwtDecode(t);
  } catch {
    return null;
  }
};

