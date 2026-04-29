import { z } from "zod";

export const createProjectSchema = z.object({
  id: z.number().nullable(),
  project_name: z.string().min(2, "Project name is too short"),
  company_id: z.number({ error: "Company is required" }).nullable(),
  company_name: z.string().nullable(),
  users: z.array(z.number()).nullable(),
});

export type CreateProjectPayload = z.infer<typeof createProjectSchema>;

export const createProjectDefaults: CreateProjectPayload = {
  id: null,
  project_name: "",
  company_id: null,
  company_name: null,
  users: [],
};

export const updateProjectSchema = z.object({
  id: z.number().nullable(),
  project_name: z.string().min(2, "Project name is too short"),
  company_id: z.number({ error: "Company is required" }).nullable(),
  company_name: z.string().nullable(),
  users: z.array(z.number()).nullable(),
});

export type UpdateProjectPayload = z.infer<typeof updateProjectSchema>;