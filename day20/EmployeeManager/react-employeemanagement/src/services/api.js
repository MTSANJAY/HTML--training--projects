import axios from "axios";

const API = axios.create({
  baseURL: "https://6a4b3682f5eab0bb6b6256fd.mockapi.io",
});

export default API;