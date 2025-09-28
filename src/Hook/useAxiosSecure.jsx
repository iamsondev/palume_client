// useAxiosSecure.jsx
import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "https://pawlume-server.vercel.app",
});

// Cached token store
let cachedToken = null;
let tokenExpiry = null;

const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return null;

  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  // fresh token নাও এবং cache করো
  const token = await user.getIdToken(true);
  cachedToken = token;
  tokenExpiry = now + 55 * 60 * 1000; // ৫৫ মিনিট পর্যন্ত valid ধরে নিচ্ছি

  return token;
};

const useAxiosSecure = () => {
  axiosSecure.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
