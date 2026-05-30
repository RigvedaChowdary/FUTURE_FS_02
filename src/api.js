import axios from "axios";

const API = axios.create({
  baseURL: "https://future-fs-02-ij3q.onrender.com/api",
});

export default API;