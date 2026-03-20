import { apiFetch } from "../apiClients";

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
