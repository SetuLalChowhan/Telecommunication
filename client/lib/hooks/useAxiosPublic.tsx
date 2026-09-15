import axios from "axios";

console.log(process.env.NEXT_PUBLIC_API_URL);

const useAxiosPublic = () => {
  const axiosPublic = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
  });
  axiosPublic.interceptors.request.use((config: any) => {
    config.headers = {
      ...config.headers,
    };
    return config;
  });

  return axiosPublic;
};

export default useAxiosPublic;
