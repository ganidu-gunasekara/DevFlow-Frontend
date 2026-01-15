import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  name: z.string().min(3, "Full name must be at least 3 characters"),
});

export type UserProfileFormValues = z.infer<typeof registerSchema>;
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function validateUserProfile(values: unknown): {values: UserProfileFormValues | null;errors: FormErrors<UserProfileFormValues>;} {
  const result = registerSchema.safeParse(values);

  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: FormErrors<UserProfileFormValues> = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof UserProfileFormValues | undefined;
    if (!field || errors[field]) continue;
    errors[field] = issue.message;
  }

  return { values: null, errors };
}
