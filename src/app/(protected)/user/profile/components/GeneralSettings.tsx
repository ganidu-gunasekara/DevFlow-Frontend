import { TextField } from "@/src/components/form/TextField";
import AvatarPicker from "./AvatarPicker";
import { ChangeEvent } from "react";
import { FormErrors, UserProfileFormValues } from "@/src/lib/user/profile/userProfileValidation";

type GeneralSettingProps = {
  form: UserProfileFormValues;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors<UserProfileFormValues>;
}

function onSubmit(){
  
}

export default function GeneralSetting({form, handleChange, errors} : GeneralSettingProps) {
    return(
        <form className="flex flex-col flex-1 w-full h-full min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex justify-center w-full mt-8">
              <AvatarPicker />
            </div>

            <div className="flex w-full flex-col gap-4 px-6 md:flex-row">
              <TextField
                label="Full Name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                error={errors.name}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
          </div>

          <footer className="form-footer">
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                Save
              </button>
            </div>
          </footer>
        </form>
    )
}