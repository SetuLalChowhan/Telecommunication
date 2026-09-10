import { selectCurrentToken } from "@/redux/slices/authSlice";
import axios, { AxiosHeaders } from "axios";
import { useSelector } from "react-redux";

const useAxiosSecure = () => {
  const token = useSelector(selectCurrentToken); // ✅ get token

  const axiosSecure = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  });

  axiosSecure.interceptors.request.use((config) => {
    if (token) {
      // ✅ Type-safe headers assignment
      config.headers = new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${token}`,
      });
    }
    return config;
  });

  return axiosSecure;
};

export default useAxiosSecure;
