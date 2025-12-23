import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const getUserRole = () => {
  const token = getToken();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const requireAuth = (role) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  if (role && userRole !== role) return false;
  return true;
};