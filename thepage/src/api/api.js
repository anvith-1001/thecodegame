import axios from "axios";

const API_BASE = "http://localhost:8000"; 


const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});


export const createUser = async (username, guest = false) => {
  const res = await api.post(`/users?guest=${guest}`, null, {
    params: { username },
  });
  return res.data.user;
};

export const getUser = async (username) => {
  const res = await api.get(`/users/by-name/${username}`);
  return res.data;
};

export const getTopics = async () => {
  const res = await api.get(`/challenges/topics`);
  return res.data.topics;
};

export const getRandomChallenge = async (username, topic) => {
  const res = await api.get(`/challenges/random`, { params: { username, topic } });
  return res.data;
};

export const submitChallenge = async (submission) => {
  const res = await api.post(`/challenges/submit`, submission);
  return res.data;
};

export default api;
