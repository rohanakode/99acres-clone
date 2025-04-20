import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE}/api/properties`;

export const getAllProperties = () => {
  return axios.get(BASE_URL);
};
