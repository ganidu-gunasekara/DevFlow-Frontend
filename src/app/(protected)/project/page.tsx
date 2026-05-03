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
import { FolderKanban, Plus, Users } from "lucide-react";
import { useAuthStore } from "@/src/lib/auth/authStore";

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
  const user = useAuthStore((state) => state.user);
  const isAdminOrSuperAdmin =
    user?.user_type === "SUPER_ADMIN" || user?.user_type === "ADMIN";

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
      const data = await getProjects(false);
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

  const handleDelete = (project: Project) => setDeleteTarget(project);

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
    <div className="flex flex-col w-full flex-1 min-h-0 overflow-hidden">
      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="page-icon">
            <FolderKanban size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text tracking-tight leading-tight">
              Projects
            </h1>
            <p className="text-xs text-muted mt-px">
              Manage your projects and teams
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        <button
          type="button"
          className={`page-tab${activeTab === "all" ? " page-tab--active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <FolderKanban size={14} />
          All Projects
        </button>
        <button
          type="button"
          className={`page-tab${activeTab === "new" ? " page-tab--active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          <Plus size={14} />
          {selectedProject ? `Edit · ID ${selectedProject.id}` : "Add New"}
        </button>
      </div>

      {/* Content */}
      <div className="page-content">
        {activeTab === "all" && (
          <>
            {deleteTarget !== null && (
              <Popup
                title="Delete Project"
                body={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
                btnValue1="Delete"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
              />
            )}

            <div className="flex flex-col flex-1 min-h-0">
              <div className="header-card">
                <FolderKanban size={14} className="text-muted" />
                <span className="text-sm font-semibold text-text">
                  {projectList.length}{" "}
                  {projectList.length === 1 ? "project" : "projects"}
                </span>
              </div>

              <div className="scroll-area">
                <MainTable
                  columns={COLUMNS}
                  data={projectList}
                  includeDelete
                  includeEdit
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <div className="list-footer">
                  {loading && (
                    <span>
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                      <span className="loading-dot" />
                    </span>
                  )}
                  {!loading && projectList.length === 0 && "No projects found"}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "new" && (
          <div className="flex flex-col flex-1">
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

            <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
              <div className="form-card flex-1 overflow-y-auto">
                {serverError && (
                  <div className="error-alert">{serverError}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField label="Project Name" error={errors.project_name}>
                    <input
                      className="input-text"
                      type="text"
                      name="project_name"
                      placeholder="My awesome project"
                      value={formData.project_name}
                      onChange={handleChange}
                    />
                  </FormField>

                  {isAdminOrSuperAdmin && (
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
                        placeholder="Search company…"
                        isClearable
                      />
                    </FormField>
                  )}

                  <FormField label="Team Members">
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
                      <Users size={14} />
                      Assign Users
                      {selectedUserIds.length > 0 && (
                        <span className="badge-pill">
                          {selectedUserIds.length}
                        </span>
                      )}
                    </button>
                  </FormField>
                </div>
              </div>

              <div className="form-footer mt-3">
                <button
                  type="button"
                  className="btn-warning"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedProject ? "Update Project" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
