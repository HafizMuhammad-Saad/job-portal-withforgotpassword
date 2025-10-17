import axios from "axios";
// import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: "",
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

//Request Interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response Interceptors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
        if (error.response.status === 401) {
          // redirect to login page
          window.location.href = "/";
        }
    } else if (error.response.status === 500) {
      // Handle server errors
      console.log("Server error");
    } else if (error.code === "ECONNABORTED") {
      // Handle timeout errors
      console.log("Request timed out");
        
    } 
    return Promise.reject(error);
  }
);

export default axiosInstance;