"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { BellIcon, Menu, X } from "lucide-react";
import AvatarPicker from "./components/AvatarPicker";
import { TextField } from "@/src/components/form/TextField";
import {
  FormErrors,
  UserProfileFormValues,
} from "@/src/lib/user/profile/userProfileValidation";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import { getUser } from "@/src/lib/user/userApi";
import { useAuthStore } from "@/src/lib/auth/authStore";
import { toast } from "sonner";
import GeneralSetting from "./components/GeneralSettings";

const initialValues: UserProfileFormValues = {
  email: "",
  name: "",
};

type SettingsTab = "general" | "language" | "theme";
export default function UserProfilePage() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => s.isAuthReady);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<UserProfileFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors<UserProfileFormValues>>({});
  const [acitiveTab, setActiveTab] = useState<SettingsTab>("general");

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const userId = user._id;
        if (userId) {
          const data = await getUser(userId);
          setForm(data);
        }
      } catch (err: any) {
        toast.error(err.message);
      }
    })();
  }, [ready, user]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }

  function handleActiveTab(name: SettingsTab) {
    setActiveTab(name);
  }

  return (
    <main className="app-page md:flex">
      {isOpen && (
        <button
          aria-label="Close overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`
          sidebar
          fixed top-0 left-0 z-40 h-screen w-72
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:h-auto md:w-72
        `}
      >
        <div className="flex justify-end md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
            className="icon-btn"
          >
            <X className="w-8 h-10" />
          </button>
        </div>

        <ul className="mt-4 md:mt-12">
          <li
            className="sidebar-item sidebar-item--top"
            onClick={() => handleActiveTab("general")}
          >
            General Settings
          </li>
          <li
            className="sidebar-item"
            onClick={() => handleActiveTab("language")}
          >
            Language
          </li>
          <li className="sidebar-item" onClick={() => handleActiveTab("theme")}>
            Themes
          </li>
        </ul>
      </aside>

      <section className="flex flex-col flex-1 min-h-screen">
        <div className="topbar">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            className="icon-btn md:hidden"
          >
            <Menu className="w-8 h-8" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open notifications"
              className="icon-btn"
            >
              <BellIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        {acitiveTab == "general" && (
          <GeneralSetting {...{ form, handleChange, errors }} />
        )}
      </section>
    </main>
  );
}
