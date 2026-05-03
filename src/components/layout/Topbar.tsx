"use client";

import { BellIcon, Menu } from "lucide-react";
import { ThemeToggle } from "@/src/components/theme/ThemeToggle";
import { getProjects } from "@/src/lib/project/projectApi";
import SelectOptions from "../ui/SelectOptions";
import { useCurrentProjectStore } from "@/src/lib/project/projectStore";
import { useEffect, useState } from "react";
import UserOptions from "../ui/UserOptions";
import { getUser, updateUser } from "@/src/lib/user/userApi";
import { useAuthStore } from "@/src/lib/auth/authStore";

interface topBarProps {
  openMenu: boolean;
  setOpenMenu: (value: boolean) => void;
}

export function Topbar({ openMenu, setOpenMenu }: topBarProps) {

  const authReady = useAuthStore((state) => state.isAuthReady);
  const loadProjects = async () => {
    return await getProjects(true);
  };

  const currentProject = useCurrentProjectStore(
    (state) => state.currentProject,
  );

  const handleChange = async (id: number, name: string) => {
    useCurrentProjectStore.getState().setCurrentProject({ id: id, name: name });
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;
    await updateUser(Number(userId), { selected_project_id: id });
  };

  const fetchUser = async () => {
    const userId = useAuthStore.getState().user?.id;
    console.log("user id " + useAuthStore.getState().user);
    const data = await getUser(Number(userId));
    if (data.selected_project_id && data.selected_project_name) {
      useCurrentProjectStore.getState().setCurrentProject({
        id: data.selected_project_id,
        name: data.selected_project_name,
      });
    }
  };

  useEffect(() => {
    console.log(authReady);
    if (!authReady) return;
    fetchUser();
  }, [authReady]);

  const [openUserOptions, setOpenUserOptions] = useState<boolean>(false);
  return (
    <div className="topbar">
      <button
        type="button"
        aria-label="Open menu"
        className="icon-btn"
        onClick={() => setOpenMenu(!openMenu)}
      >
        <Menu className="w-4 h-4" />
      </button>

      <span className="topbar-brand hidden md:block">DevFlow</span>
      <div className="flex ml-3 w-40 md:w-52 shrink-0">
        <SelectOptions
          loadFunction={loadProjects}
          value={currentProject ? currentProject.id : null}
          displayValue={currentProject ? currentProject.name : ""}
          onChange={(option) => handleChange(option?.value, option?.label)}
          placeholder="Please select a project"
          isClearable={false}
          styles={{
            singleValue: (base: any) => ({
              ...base,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "600",
              color: "rgb(var(--text))",
              "&::before": {
                content: '""',
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "rgb(var(--brand))",
                flexShrink: 0,
              },
            }),
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <button
          type="button"
          aria-label="Open notifications"
          className="icon-btn relative"
        >
          <BellIcon className="w-4 h-4" />
          <span className="notif-dot" />
        </button>

        <div className="relative">
          <div
            className="avatar cursor-pointer"
            onClick={() => setOpenUserOptions(!openUserOptions)}
          >
            U
          </div>
          <div className="absolute right-0 top-full mt-1 z-50">
            {openUserOptions && <UserOptions />}
          </div>
        </div>
      </div>
    </div>
  );
}
