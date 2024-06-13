import { jwtDecode } from "jwt-decode"; // Correctly import jwtDecode
import axios from "axios";

const ACCESS_TOKEN = "__token__";

export const saveToken = (data) => {
  const { token } = data;
  setStorage(ACCESS_TOKEN, token);
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};

export function getAccessToken() {
  return getStorage(ACCESS_TOKEN);
}

export const setStorage = (storageName, value) => {
  localStorage.setItem(storageName, value);
};

export const getStorage = (storageName) => {
  localStorage.getItem(storageName);
};

export const decodeToken = () => {
  const storedToken = localStorage.getItem("__token__");
  return jwtDecode(storedToken);
};

export const fetchAPI = async (endPoint, setData, setLoading) => {
  const token = localStorage.getItem("__token__");
  const headers = headerAPI(token);

  try {
    const response = await axios.get(endPoint, { headers });
    if (response.data.success) {
      setData(response.data.data);
      console.log(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    if (setLoading) setLoading(false); // Ensure loading state is updated
  }
};


export const fetchAPIUserExpert = async (endPoint, setData) => {
  const headers = headerAPI();
  try {
    const response = await axios.get(endPoint, {
      headers,
    });
    if (response.data.success) {
      setData(response.data.data);
      console.log(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export function headerAPI() {
  const token = localStorage.getItem("__token__");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  return headers;
}

export const API_URL = process.env.API_URL || 'https://bitstormbe1.zeabur.app/api'
