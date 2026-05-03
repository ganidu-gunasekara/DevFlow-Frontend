import { z } from "zod";

export const createUserSchema = (isEdit = false) => z.object({
  id: z.number().nullable(),
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name is too short"),
  password: isEdit
    ? z.string().optional()
    : z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: isEdit
    ? z.string().optional()
    : z.string(),
  company_id: z.number().nullable(),
  company_name: z.string().nullable(),
  type: z.string().min(1, "User type is required"),
  selected_project_id: z.number().nullable().optional(),
}).refine(d => isEdit || d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type CreateUserPayload = z.infer<ReturnType<typeof createUserSchema>>;

export const createUserDefaults: CreateUserPayload = {
  id: 0,
  email: "",
  name: "",
  password: "",
  confirm_password: "",
  company_id: null,
  company_name: null,
  type: "",
  selected_project_id: null,
};


export interface SearchUserPayload {
    keyword: string;
    showDeleted: boolean;
    company_id: number;
}

export const searchUserDefaults: SearchUserPayload = {
  keyword: "",
  showDeleted: false,
  company_id: 0,
};




