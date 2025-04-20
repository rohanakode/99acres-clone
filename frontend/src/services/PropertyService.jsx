import axios from "axios";

const BASE_URL = "http://localhost:5000/api/properties";

export const getAllProperties = () => {
  return axios.get(BASE_URL);
};
