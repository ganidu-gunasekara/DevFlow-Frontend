export type RegisterFormValues = {
  email: string;
  name: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string) {
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Enter a valid email address";
  return undefined;
}

function validatePassword(password: string) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
}

function validateName(name: string) {
  if (!name) return "Name is required";
  if (name.trim().length < 3) return "Full name must be at least 3 characters";
  return undefined;
}

export function validateRegister(values: RegisterFormValues): FormErrors<RegisterFormValues> {
  const errors: FormErrors<RegisterFormValues> = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateLogin(values: LoginFormValues): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}
