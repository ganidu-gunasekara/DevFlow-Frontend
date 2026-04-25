"use client";
import { useForm } from "@/src/components/form/useForm";
import { FormField } from "@/src/components/form/FormField";
import MainTable from "@/src/components/ui/MainTable";
import SelectOptions from "@/src/components/ui/SelectOptions";
import Popup from "@/src/components/ui/Popup";
import AddItemsPopUp from "@/src/components/ui/AddItemsPopUp";
import { getCompanies } from "@/src/lib/company/companyApi";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
} from "@/src/lib/project/projectApi";
import {
  createProjectSchema,
  createProjectDefaults,
  CreateProjectPayload,
} from "@/src/lib/project/project.schema";
import { getUsers } from "@/src/lib/user/userApi";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Project {
  id: number;
  [key: string]: any;
}

const COLUMNS = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Project Name" },
  { accessorKey: "company_name", header: "Company" },
  { accessorKey: "action", header: "Action" },
];

export default function ProjectPage() {
  const [activeTab, setActiveTab] = useState<"all" | "new">("all");
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [serverError, setServerError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [showAssignUsers, setShowAssignUsers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const { formData, setFormData, handleChange, resetForm, validate, errors } =
    useForm<CreateProjectPayload>(createProjectDefaults, createProjectSchema);

  const loadCompanies = async () => await getCompanies({}, true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjectList(data);
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersForProject = useCallback(
    (page: number, keyword: string) => {
      return getUsers(page, {
        keyword,
        showDeleted: false,
        company_id: formData.company_id ?? 0,
      });
    },
    [formData.company_id],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (selectedProject) {
        await updateProject(selectedProject.id, {
          ...formData,
          users: selectedUserIds,
        });
      } else {
        await createProject({ ...formData, users: selectedUserIds });
      }
      setActiveTab("all");
      fetchData();
      setServerError("");
      resetForm();
      setSelectedProject(null);
      setSelectedUserIds([]);
    } catch (err: any) {
      setServerError(err?.message || "Network error. Please try again.");
    }
  };

  const handleEdit = async (project: Project) => {
    try {
      setSelectedProject(project);
      const data = await getProject(project.id);
      setFormData({
        id: data.id,
        project_name: data.name,
        company_id: data.company_id,
        company_name: data.company_name,
        users: data.user_ids,
      });
      setSelectedUserIds(data.user_ids ?? []);
      setActiveTab("new");
      setServerError("");
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    setActiveTab("all");
    setSelectedProject(null);
    setSelectedUserIds([]);
    resetForm();
    setServerError("");
  };

  const handleDelete = (project: Project) => {
    setDeleteTarget(project);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProject(deleteTarget.id);
      setProjectList((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col w-full border-b border-border page-height">
      <div className="flex justify-end w-full mt-4">
        <div
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 cursor-pointer transition text-lg border border-border rounded-tl
            ${
              activeTab === "all"
                ? "bg-surface text-brand border-b-surface"
                : "bg-surface-2 text-muted hover:text-brand hover:bg-brand-soft"
            }`}
        >
          All
        </div>
        <div
          onClick={() => setActiveTab("new")}
          className={`px-6 py-3 cursor-pointer transition text-lg border border-border rounded-tl
            ${
              activeTab === "new"
                ? "bg-surface text-brand border-b-surface"
                : "bg-surface-2 text-muted hover:text-brand hover:bg-brand-soft"
            }`}
        >
          {selectedProject ? `ID : ${selectedProject.id}` : "Add New"}
        </div>
      </div>

      <div className="w-full p-3 flex flex-col flex-1 min-h-0">
        {activeTab === "all" && (
          <>
            {deleteTarget !== null && (
              <Popup
                title="Delete Project"
                body={`Are you sure you want to delete ${deleteTarget.name}?`}
                btnValue1="Delete"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
              />
            )}

            <div className="flex flex-col w-full flex-1 min-h-0">
              <div className="header-card">
                <span className="label font-semibold">Projects</span>
              </div>

              <div className="flex flex-col overflow-y-auto flex-1 min-h-0">
                <MainTable
                  columns={COLUMNS}
                  data={projectList}
                  includeDelete
                  includeEdit
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <div className="py-4 text-center text-muted">
                  {loading && "Loading..."}
                  {!loading && projectList.length === 0 && "No projects found"}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "new" && (
          <div className="flex flex-col w-full h-full">
            {showAssignUsers && (
              <AddItemsPopUp
                title="Assign Users"
                displayKey="name"
                selectedIds={selectedUserIds}
                setSelectedIds={setSelectedUserIds}
                onClose={() => setShowAssignUsers(false)}
                fetchFunction={fetchUsersForProject}
              />
            )}

            <form
              className="flex flex-col w-full h-full"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col flex-1 bg-surface p-6 rounded shadow overflow-y-auto">
                {serverError && (
                  <div className="mb-4 text-sm text-red-500">{serverError}</div>
                )}

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-3">
                    <FormField label="Project Name" error={errors.project_name}>
                      <input
                        className="input-text"
                        type="text"
                        name="project_name"
                        placeholder="Project name"
                        value={formData.project_name}
                        onChange={handleChange}
                      />
                    </FormField>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <FormField label="Company" error={errors.company_id}>
                      <SelectOptions
                        loadFunction={loadCompanies}
                        value={formData.company_id}
                        displayValue={formData.company_name ?? ""}
                        onChange={(option) => {
                          if (selectedUserIds.length > 0) {
                            toast.warning(
                              "Remove all assigned users before changing the company.",
                            );
                            return;
                          }
                          handleChange(
                            {
                              name: "company_id",
                              value: option?.value || "",
                              extraFields: {
                                company_name: option?.label || "",
                              },
                            },
                            true,
                          );
                        }}
                        placeholder="Search company..."
                        isClearable
                      />
                    </FormField>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <FormField label="Users">
                      <button
                        type="button"
                        className="btn-primary w-full"
                        onClick={() => {
                          if (!formData.company_id) {
                            toast.warning(
                              "Please select a company before assigning users.",
                            );
                            return;
                          }
                          setShowAssignUsers(true);
                        }}
                      >
                        Assign Users{" "}
                        {selectedUserIds.length > 0 &&
                          `(${selectedUserIds.length})`}
                      </button>
                    </FormField>
                  </div>
                </div>
              </div>

              <div className="form-footer flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-warning"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedProject ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
