"use client";
import { useForm } from "@/src/components/form/useForm";
import { FormField } from "@/src/components/form/FormField";
import MainTable from "@/src/components/ui/MainTable";
import Popup from "@/src/components/ui/Popup";
import {
  createCompany,
  deleteCompany,
  getCompanies,
} from "@/src/lib/company/companyApi";
import {
  createCompanySchema,
  createCompanyDefaults,
  CreateCompanyPayload,
} from "@/src/lib/company/company.schema";
import { useEffect, useState } from "react";

interface Company {
  id: number;
  [key: string]: any;
}

const COLUMNS = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "company_name", header: "Company Name" },
  { accessorKey: "action", header: "Action" },
];

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<"all" | "new">("all");
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);

  const { formData, handleChange, resetForm, validate, errors } =
    useForm<CreateCompanyPayload>(createCompanyDefaults, createCompanySchema);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCompanies({}, false);
      setCompanyList(data);
    } catch (err: any) {
      setServerError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await createCompany(formData);
      setActiveTab("all");
      fetchData();
      setServerError("");
      resetForm();
    } catch (err: any) {
      setServerError(err?.message || "Network error. Please try again.");
    }
  };

  const handleCancel = () => {
    setActiveTab("all");
    resetForm();
    setServerError("");
  };

  const handleDelete = (company: Company) => {
    setDeleteTarget(company);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCompany(deleteTarget.id);
      setCompanyList((prev) => prev.filter((c) => c.id !== deleteTarget.id));
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
          Add New
        </div>
      </div>

      <div className="w-full p-3 flex flex-col flex-1 min-h-0">
        {activeTab === "all" && (
          <>
            {deleteTarget !== null && (
              <Popup
                title="Delete Company"
                body={`Are you sure you want to delete ${deleteTarget.company_name}?`}
                btnValue1="Delete"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
              />
            )}

            <div className="flex flex-col w-full flex-1 min-h-0">
              <div className="header-card">
                <span className="label font-semibold">Companies</span>
              </div>

              <div className="flex flex-col overflow-y-auto flex-1 min-h-0">
                <MainTable
                  columns={COLUMNS}
                  data={companyList}
                  includeDelete
                  onDelete={handleDelete}
                />
                <div className="py-4 text-center text-muted">
                  {loading && "Loading..."}
                  {!loading && companyList.length === 0 && "No companies found"}
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
                    <FormField label="Company Name" error={errors.company_name}>
                      <input
                        className="input-text"
                        type="text"
                        name="company_name"
                        placeholder="Company name"
                        value={formData.company_name}
                        onChange={handleChange}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
