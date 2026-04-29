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
import { Building2, Plus } from "lucide-react";

interface Company {
  id: number;
  [key: string]: any;
}

const COLUMNS = [
  { accessorKey: "id",           header: "ID" },
  { accessorKey: "company_name", header: "Company Name" },
  { accessorKey: "action",       header: "Action" },
];

export default function CompanyPage() {
  const [activeTab, setActiveTab]       = useState<"all" | "new">("all");
  const [companyList, setCompanyList]   = useState<Company[]>([]);
  const [serverError, setServerError]   = useState("");
  const [loading, setLoading]           = useState(false);
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

  const handleDelete  = (company: Company) => setDeleteTarget(company);

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

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="flex flex-col w-full flex-1 min-h-0 overflow-hidden">

      {/* Page header */}
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="page-icon"><Building2 size={18} /></div>
          <div>
            <h1 className="text-lg font-bold text-text tracking-tight leading-tight">Companies</h1>
            <p className="text-xs text-muted mt-px">Manage your organisations</p>
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
          <Building2 size={14} />
          All Companies
        </button>
        <button
          type="button"
          className={`page-tab${activeTab === "new" ? " page-tab--active" : ""}`}
          onClick={() => setActiveTab("new")}
        >
          <Plus size={14} />
          Add New
        </button>
      </div>

      {/* Content */}
      <div className="page-content">

        {activeTab === "all" && (
          <>
            {deleteTarget !== null && (
              <Popup
                title="Delete Company"
                body={`Are you sure you want to delete "${deleteTarget.company_name}"? This action cannot be undone.`}
                btnValue1="Delete"
                onCancel={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
              />
            )}

            <div className="flex flex-col flex-1 min-h-0">
              <div className="header-card">
                <Building2 size={14} className="text-muted" />
                <span className="text-sm font-semibold text-text">
                  {companyList.length} {companyList.length === 1 ? "company" : "companies"}
                </span>
              </div>

              <div className="scroll-area">
                <MainTable
                  columns={COLUMNS}
                  data={companyList}
                  includeDelete
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
                  {!loading && companyList.length === 0 && "No companies found"}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "new" && (
          <div className="flex flex-col flex-1">
            <form className="flex flex-col flex-1" onSubmit={handleSubmit}>
              <div className="form-card flex-1">
                {serverError && <div className="error-alert">{serverError}</div>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <FormField label="Company Name" error={errors.company_name}>
                    <input
                      className="input-text"
                      type="text"
                      name="company_name"
                      placeholder="Acme Corporation"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </FormField>
                </div>
              </div>

              <div className="form-footer mt-3">
                <button type="button" className="btn-warning" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Company
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
