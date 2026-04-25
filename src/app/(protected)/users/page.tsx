"use client";
import { useForm } from "@/src/components/form/useForm";
import { FormField } from "@/src/components/form/FormField";
import MainTable from "@/src/components/ui/MainTable";
import SelectOptions from "@/src/components/ui/SelectOptions";
import { getCompanies } from "@/src/lib/company/companyApi";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "@/src/lib/user/userApi";
import {
  createUserSchema,
  createUserDefaults,
  CreateUserPayload,
  SearchUserPayload,
  searchUserDefaults,
} from "@/src/lib/user/user.schema";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Popup from "@/src/components/ui/Popup";

interface User {
  id: number;
  [key: string]: any;
}

const COLUMNS = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "action", header: "Action" },
];

const TYPE_OPTIONS = [
  { value: "DEVELOPER", label: "Developer" },
  { value: "ADMIN", label: "Admin" },
];

export default function User() {
  const [activeTab, setActiveTab] = useState<"all" | "new">("all");
  const [searchForm, setSearchForm] =
    useState<SearchUserPayload>(searchUserDefaults);
  const [userList, setUserList] = useState<User[]>([]);
  const [serverError, setServerError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const isSearching = useRef(false);

  const { formData, setFormData, handleChange, resetForm, validate, errors } =
    useForm<CreateUserPayload>(
      createUserDefaults,
      createUserSchema(selectedUser ? true : false),
    );

  const loadCompanies = async () => await getCompanies({}, true);

  const fetchData = async (pageNum = 0, search = searchForm) => {
    if (loadingUsers) return;
    setLoadingUsers(true);
    const data = await getUsers(pageNum, search);
    setUserList((prev) =>
      pageNum === 0 ? data.content : [...prev, ...data.content],
    );
    setHasMore(!data.last);
    setLoadingUsers(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (selectedUser) {
        await updateUser(formData);
      } else {
        await createUser(formData);
      }

      setActiveTab("all");
      fetchData(0);
      setServerError("");
      resetForm();
      setSelectedUser(null);
    } catch (err: any) {
      setServerError(err?.message || "Network error. Please try again.");
    }
  };

  const handleEdit = async (user: User) => {
    try {
      setSelectedUser(user);
      const data = await getUser(user.id);
      setFormData(data);
      setActiveTab("new");
      setServerError("");
    } catch (err: any) {
      console.error(err);
      setServerError(err?.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    setActiveTab("all");
    setSelectedUser(null);
    resetForm();
    setServerError("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    isSearching.current = true;
    setPage(0);
    setHasMore(true);
    setUserList([]);
    fetchData(0, searchForm);
    setTimeout(() => (isSearching.current = false), 500);
  };

  const handleReset = () => {
    isSearching.current = true;
    setPage(0);
    setHasMore(true);
    setUserList([]);
    setSearchForm(searchUserDefaults);
    fetchData(0, searchUserDefaults);
    setTimeout(() => (isSearching.current = false), 500);
  };

  const handleDelete = (user: User) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser(deleteTarget.id);
      setUserList((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMore &&
        !loadingUsers &&
        !isSearching.current
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
      }
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loadingUsers]);

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
          {selectedUser ? `ID : ${selectedUser.id}` : "Add New"}
        </div>
      </div>

      <div className="w-full p-3 flex flex-col flex-1 min-h-0">
        {activeTab === "all" && (
          <>
            {deleteTarget !== null && (
              <Popup
                title="Delete User"
                body={`Are you sure you want to delete ${deleteTarget.name}?`}
                btnValue1="Delete"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
              />
            )}

            <div className="flex flex-col w-full flex-1 min-h-0">
              <form className="w-full" onSubmit={handleSearch}>
                <div className="header-card gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <label className="label">User</label>
                    <input
                      className="input-text"
                      type="text"
                      name="keyword"
                      placeholder="Search users..."
                      value={searchForm.keyword}
                      onChange={(e) =>
                        setSearchForm((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    {loadingUsers ? "Searching..." : "Search"}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </form>

              <div className="flex flex-col overflow-y-auto flex-1 min-h-0">
                <MainTable
                  columns={COLUMNS}
                  data={userList}
                  includeDelete
                  includeEdit
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <div ref={loaderRef} className="py-4 text-center text-muted">
                  {loadingUsers && "Loading..."}
                  {!hasMore && "No more users"}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "new" && (
          <div className="flex flex-col w-full h-full">
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
                    <FormField label="Email" error={errors.email}>
                      <input
                        className="input-text"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormField>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <FormField label="Name" error={errors.name}>
                      <input
                        className="input-text"
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </FormField>
                  </div>

                  {!selectedUser && (
                    <>
                      <div className="col-span-12 md:col-span-3">
                        <FormField label="Password" error={errors.password}>
                          <input
                            className="input-text"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </FormField>
                      </div>

                      <div className="col-span-12 md:col-span-3">
                        <FormField
                          label="Confirm Password"
                          error={errors.confirm_password}
                        >
                          <input
                            className="input-text"
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                          />
                        </FormField>
                      </div>
                    </>
                  )}

                  <div className="col-span-12 md:col-span-3">
                    <FormField label="User Type" error={errors.type}>
                      <Select
                        name="type"
                        options={TYPE_OPTIONS}
                        value={
                          TYPE_OPTIONS.find((o) => o.value === formData.type) ||
                          null
                        }
                        onChange={(option) =>
                          handleChange(
                            { name: "type", value: option?.value || "" },
                            true,
                          )
                        }
                        placeholder="Select Type"
                        isClearable
                      />
                    </FormField>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <FormField label="Company" error={errors.company_id}>
                      <SelectOptions
                        loadFunction={loadCompanies}
                        value={formData.company_id}
                        displayValue={formData.company_name ?? ""}
                        onChange={(option) =>
                          handleChange(
                            {
                              name: "company_id",
                              value: option?.value || "",
                              extraFields: {
                                company_name: option?.label || "",
                              },
                            },
                            true,
                          )
                        }
                        placeholder="Search company..."
                        isClearable
                      />
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
                  {selectedUser ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
