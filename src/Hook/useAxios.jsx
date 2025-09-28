import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://pawlume-server.vercel.app`,
});
const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
