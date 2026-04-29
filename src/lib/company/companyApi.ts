import { apiFetch } from "../apiClients";
import { CreateCompanyPayload } from "./company.schema";

export async function getCompanies(data: {}, select: boolean) {
  const companies = await apiFetch(`/company/get`, {
    method: "GET",
    credentials: "include",
  });

  if (select) {
    return companies.map((company: any) => ({
      value: company.id,
      label: company.company_name,
    }));
  } else {
    return companies;
  }
}

export async function getCompany(id: number) {
  return await apiFetch(`/company/get/${id}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function createCompany(data: CreateCompanyPayload) {
  return await apiFetch(`/company/create`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
}

export async function deleteCompany(id: number) {
  return await apiFetch(`/company/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}
