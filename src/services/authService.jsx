import axios from "axios";


const APP_URL = import.meta.env.VITE_API;

export const register = (data) => axios.post(`${APP_URL}/register`, data);

export const login = (data) => axios.post(`${APP_URL}/login`, data);