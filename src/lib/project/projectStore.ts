import { create } from "zustand";
import { persist } from "zustand/middleware";

type Project = {
  id: number;
  name: string;
};

type ProjectState = {
  currentProject: Project | null;
  setCurrentProject: (project: Project) => void;
  clearCurrentProject : () => void
};

export const useCurrentProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      currentProject: null,
      setCurrentProject: (project) => set({ currentProject: project }),
      clearCurrentProject : () => set({currentProject :null})
    }),
    {
      name: "active-project",
    },
  ),
);
