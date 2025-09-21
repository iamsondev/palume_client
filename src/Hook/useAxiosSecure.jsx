import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

// Create axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user } = useAuth() || {};

  useEffect(() => {
    if (!user?.accessToken) return;

    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [user?.accessToken]);

  return axiosSecure; // ✅ important: return the axios instance directly
};

export default useAxiosSecure;
