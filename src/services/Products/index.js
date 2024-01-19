import { api } from "@/plugins/axios.js";

export async function getAllProducts() {
  return await api.get("/produtos");
}

export async function getProductById(id) {
  return await api.get(`/produtos/${id}`);
}

export async function createProduct(data) {
  return await api.post("/produtos", data);
}

export async function updateProduct(id, data) {
  return await api.put(`/produtos/${id}`, data);
}

export async function deleteProduct(id) {
  return await api.delete(`/produtos/${id}`);
}
