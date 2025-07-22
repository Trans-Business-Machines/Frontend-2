/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance, {
  baseURL,
  setAccessToken as setAxiosToken,
} from "../api/axiosInstance";
import axios from "axios";

import { jwtDecode } from "jwt-decode";

import navigate from "../utils";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(user)
  console.log(token)

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
    // if successfull then
    // set the access token to the axios instance and the state
    // decode the token to get the user details
    // send back the decoded user details
    // else throw an error
    try {
      const { data } = await axios.post(`${baseURL}/auth/login`, creds, {
        withCredentials: true, // to allow cookies to be sent with the request
      });
      setAxiosToken(data.accessToken);
      setToken(data.accessToken);

      // Decode the access token to get user details
      const decodedUser = jwtDecode(data.accessToken);
      setUser(decodedUser);
      return decodedUser;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // rethrow the error to be handled by the caller
    }
  };

  const logout = async () => {
    // call the logout endpoint
    // clear the access token from the axios instance
    // clear the user state
    try {
      await axiosInstance.post("/auth/logout");
      setAxiosToken(null);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {loading ? <div>Verifying user info...</div> : children}
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
