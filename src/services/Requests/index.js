import { api } from "@/plugins/axios.js";

export async function getAllRequests() {
  return await api.get("/pedidos");
}

export async function getRequestById(id) {
  return await api.get(`/pedidos/${id}`);
}

export async function createRequest(data) {
  return await api.post("/pedidos", data);
}

export async function updateRequest(id, data) {
  return await api.put(`/pedidos/${id}`, data);
}

export async function deleteRequest(id) {
  return await api.delete(`/pedidos/${id}`);
}
