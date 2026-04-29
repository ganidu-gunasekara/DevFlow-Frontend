"use client";

import { TextField } from "@/src/components/form/TextField";
import { registerUser } from "@/src/lib/auth/authApi";
import { FormErrors, RegisterFormValues, validateRegister } from "@/src/lib/auth/authValidation";
import { ChangeEvent, FormEvent, useState } from "react";
import { FaGoogle } from "react-icons/fa";

const initialValues: RegisterFormValues = {
  email: "",
  name: "",
  password: "",
};

export default function SignInPage() {

  const [form, setForm] = useState<RegisterFormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors<RegisterFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(e : ChangeEvent<HTMLInputElement>){
    const {name, value} = e.target;

    setForm ((prev) =>({
      ...prev, [name] : value
    }))

    setErrors ((prev) =>({
      ...prev, [name] : undefined
    }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    const validationErrors = validateRegister(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

     try {
      await registerUser(form);
      setSuccessMessage("Account created successfully!");
      setForm(initialValues);
    } catch (err: any) {
      console.error(err);
      setServerError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <main className="min-h-screen  bg-slate-200 bg-none lg:bg-[url('/sign-up-in-assets/sign-up-background.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="flex justify-center lg:justify-end w-full min-h-screen">
        <div className="flex flex-col items-center w-full lg:w-1/2 bg-white border-l rounded-tl-2xl rounded-bl-2xl p-4">
          <img src="/devflow-logo.png" alt="DevFlow Logo" className="w-20 mb-4"/>

          <h1 className="text-2xl font-poppins font-semibold">
            Create an account
          </h1>
          {serverError && (
            <p className="mt-2 text-sm text-red-600">{serverError}</p>
          )}
          {successMessage && (
            <p className="mt-2 text-sm text-green-600">{successMessage}</p>
          )}

          <form className="flex flex-col w-full max-w-sm space-y-4 mt-3"
           onSubmit={handleSubmit}
          >
            <TextField label="Email Address" name="email" type="email" placeholder="Enter your email address" value={form.email} onChange={handleChange} error={errors.email}/>
            <TextField label="Full Name" name="name" type="text" placeholder="Enter your full name" value={form.name} onChange={handleChange} error={errors.name}/>
            <TextField label="Password" name="password" type="password" placeholder="Create your password" value={form.password} onChange={handleChange} error={errors.password}/>

            <div className="flex flex-col space-y-1 m-2">
              <button className="flex items-center justify-center bg-purple-700 text-white font-poppins font-medium p-3 w-full border rounded-3xl"
              disabled = {isSubmitting}
              >
                Create an account
                {isSubmitting && (
                  <span className="w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            </div>

            <div className="flex flex-row justify-center items-center m-2 gap-1">
              <span className="font-poppins font-medium text-sm text-gray-500">
                Already have an account?
              </span>
              <a className="text-purple-700 underline" href="/sign-in">Login</a>
            </div>
          </form>

          <div className="w-full max-w-sm">
            <div className="flex flex-row">
              <div className="flex justify-center items-center border-b w-full mb-2"></div>
              <span className="mr-2 ml-2">Or</span>
              <div className="flex justify-center items-center border-b w-full mb-2"></div>
            </div>
          </div>

          <div className="m-3 w-full max-w-sm">
            <button className="flex items-center justify-center font-poppins font-medium p-3 w-full border border-gray-400 rounded gap-2">
              Create account with Google
              <FaGoogle className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}


