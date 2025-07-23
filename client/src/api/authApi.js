import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true
});

export const signup = (data) => API.post("/api/auth/signup", data);
export const login = (email, password) => API.post("/api/auth/login", { email, password });
