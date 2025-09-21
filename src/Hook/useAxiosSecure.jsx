// useAxiosSecure.jsx
import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
  const auth = getAuth();

  // প্রতিবার call করার সময় fresh token নাও
  axiosSecure.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
