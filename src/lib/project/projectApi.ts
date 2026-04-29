import { apiFetch } from "../apiClients";
import { CreateProjectPayload, UpdateProjectPayload } from "./project.schema";

export async function getProjects() {
  return await apiFetch(`/projects/get`, {
    method: "GET",
    credentials: "include",
  });
}

export async function getProject(id: number) {
  return await apiFetch(`/projects/get/${id}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function createProject(data: CreateProjectPayload) {
  return await apiFetch(`/projects/create`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
}

export async function updateProject(id: number, data: UpdateProjectPayload) {
  return await apiFetch(`/projects/update/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: data,
  });
}

export async function deleteProject(id: number) {
  return await apiFetch(`/projects/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}
