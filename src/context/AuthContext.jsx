import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => Cookies.get("token");

  const isValidToken = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }
      setUser({
        user_id: decoded.user_id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role || "Viewer",
      });
      return true;
    } catch (err) {
      console.error("Token validation error:", err);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = () => {
      const token = getToken();

      if (token) {
        isValidToken(token);
      }

      setLoading(false);
    };

    initAuth();
  }, []); // Only run once on mount

  const login = (token) => {
    // Safari-compatible cookie settings
    Cookies.set("token", token, {
      expires: 1, // 1 day
      path: "/",
      sameSite: "Strict",
      secure: false, // false for localhost, true for production HTTPS
    });

    isValidToken(token);
  };

  const logout = () => {
    Cookies.remove("token", { path: "/" });
    setUser(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        token: getToken(),
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
