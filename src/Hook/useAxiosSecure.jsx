import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

// axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const { user } = useAuth() || {}; // optional chaining safe
  const [instance, setInstance] = useState(axiosSecure);

  useEffect(() => {
    if (!user?.accessToken) return;

    // Add Authorization header
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Cleanup old interceptors on unmount or user change
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [user?.accessToken]);

  return instance;
};

export default useAxiosSecure;
