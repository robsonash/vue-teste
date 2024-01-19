import { api } from "@/plugins/axios.js";

export async function getAllPeople() {
  return await api.get("/pessoas");
}

export async function getPersonById(id) {
  return await api.get(`/pessoas/${id}`);
}

export async function createPerson(data) {
  return await api.post("/pessoas", data);
}

export async function updatePerson(id, data) {
  return await api.put(`/pessoas/${id}`, data);
}

export async function deletePerson(id) {
  return await api.delete(`/pessoas/${id}`);
}
