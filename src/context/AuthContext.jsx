/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import navigate from "../utils";
import Loading from "../components/Loading";
import axiosInstance, {
  baseURL,
  setAccessToken as setAxiosToken,
} from "../api/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   Refresh the access token when the app loads to get a new access token
   if the refresh token is valid
   if the refresh token is invalid then redirect to the login page
  */
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const { data } = await axiosInstance.post(
          "/auth/refresh-token",
          {},
          { withCredentials: true } // to allow cookies to be sent with the request
        );
        setAxiosToken(data.accessToken);
        setToken(data.accessToken);

        // Decode the access token to get user details
        const decodedUser = jwtDecode(data.accessToken);
        setUser(decodedUser);
      } catch (error) {
        await logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    tryRefresh();
  }, []);

  const login = async (creds) => {
    // call the login endpoint
    try {
      // if successfull then
      const { data } = await axios.post(`${baseURL}/auth/login`, creds, {
        withCredentials: true, // to allow cookies to be sent with the request
      });
      // set the access token to the axios instance and the state
      setAxiosToken(data.accessToken);
      setToken(data.accessToken);

      // decode the token to get the user details
      const decodedUser = jwtDecode(data.accessToken);
      //  save the user in context
      setUser(decodedUser);
      // send back the decoded user details
      return decodedUser;
    } catch (error) {
      // else throw an error
      throw error;
    }
  };

  const logout = async () => {
    // call the logout endpoint
    try {
      await axiosInstance.post("/auth/logout");
      // clear the access token from the axios instance
      setAxiosToken(null);
      // clear the user state
      setUser(null);
    } catch (error) {
      // throw error if logout failed
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthProvider;
