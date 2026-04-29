import { z } from "zod";

export const createCompanySchema = z.object({
  id: z.number().nullable(),
  company_name: z.string().min(2, "Company name is too short"),
});

export type CreateCompanyPayload = z.infer<typeof createCompanySchema>;

export const createCompanyDefaults: CreateCompanyPayload = {
  id: null,
  company_name: "",
};
