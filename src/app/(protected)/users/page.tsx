"use client";
import MainTable from "@/src/components/ui/MainTable";
import SelectOptions from "@/src/components/ui/SelectOptions";
import { getCompanies } from "@/src/lib/company/companyApi";
import { getUsers } from "@/src/lib/user/userApi";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";

export default function User() {
  interface User {
    id: number;
    [key: string]: any;
  }
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirm_password: "",
    type: "",
    company_id: "",
    company_name: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [activeTab, setActiveTab] = useState<"all" | "new">("all");
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const loadCompanies = async (inputValue?: string) => {
    return await getCompanies({}, true);
  };
  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "action", header: "Action" },
  ];
  const typeOptions = [
    { value: "DEVELOPER", label: "Developer" },
    { value: "ADMIN", label: "Admin" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers();
      setUserList(data);
    };
    fetchData();
  }, []);

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setActiveTab("new");
  };

  const handleDelete = (user: any) => {};
  return (
    <div className="flex flex-col w-full border-b border-border page-height">
      <div className="flex justify-end w-full mt-4">
        <div
          onClick={() => {
            setActiveTab("all");
          }}
          className={`px-6 py-3 cursor-pointer transition text-lg border border-border rounded-tl
            ${activeTab == "all" ? "bg-surface text-brand border-b-surface" : "bg-surface-2 text-muted hover:text-brand hover:bg-brand-soft"}`}
        >
          All
        </div>
        <div
          onClick={() => setActiveTab("new")}
          className={`px-6 py-3 cursor-pointer transition text-lg border border-border rounded-tl
            ${activeTab == "new" ? "bg-surface text-brand border-b-surface" : "bg-surface-2 text-muted hover:text-brand hover:bg-brand-soft"}`}
        >
          {selectedUser ? `ID : ${selectedUser.id}` : "Add New"}
        </div>
      </div>
      <div className="w-full p-3 flex flex-col flex-1 min-h-0">
        {activeTab == "all" && (
          <div className="flex flex-col w-full">
            <form className="w-full">
              <div className="header-card gap-2">
                <div className="flex flex-row items-center gap-2">
                  <label className="label">User</label>
                  <input
                    className="input-text"
                    type="text"
                    placeholder="User"
                  ></input>
                </div>
                <div>
                  <button className="btn-primary">Search</button>
                </div>
                <div>
                  <button className="btn-primary">Reset</button>
                </div>
              </div>
            </form>
            <MainTable
              columns={columns}
              data={userList}
              includeDelete={true}
              includeEdit={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
        {activeTab == "new" && (
          <div className="flex flex-col w-full h-full">
            <form className="flex flex-col w-full h-full">
              <div className="flex flex-col flex-1 bg-surface p-6 rounded shadow overflow-y-auto">
                <div className="grid grid-cols-12  gap-4">
                  <div className="col-span-12 md:col-span-3 gap-1">
                    <label className="label">Email</label>
                    <input
                      className="input-text"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-3 gap-1">
                    <label className="label">Name</label>
                    <input
                      className="input-text"
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  {!selectedUser && (
                    <>
                      <div className="col-span-12 md:col-span-3 gap-1">
                        <label className="label">Password</label>
                        <input
                          className="input-text"
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-span-12 md:col-span-3 gap-1">
                        <label className="label">Confirm Password</label>
                        <input
                          className="input-text"
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirm_password}
                          onChange={handleChange}
                        />

                        {formData.confirm_password &&
                          formData.password !== formData.confirm_password && (
                            <span className="text-xs text-red-500">
                              Passwords do not match
                            </span>
                          )}
                      </div>
                    </>
                  )}

                  <div className="col-span-12 md:col-span-3 flex flex-col gap-1">
                    <label className="label">User Type</label>
                    <Select
                      options={typeOptions}
                      value={
                        typeOptions.find((o) => o.value === formData.type) ||
                        null
                      }
                      onChange={() => {}}
                      placeholder="Select Type"
                      isClearable
                    />
                  </div>

                  <div className="col-span-12 md:col-span-3 flex flex-col gap-1">
                    <label className="label">Company</label>
                    <SelectOptions
                      loadFunction={loadCompanies}
                      value={formData.company_id}
                      displayValue={formData.company_name}
                      onChange={(option: any) =>{
                        setFormData((prev) => ({
                          ...prev,
                          company_id: option?.value,
                          company_name: option?.label,
                        }))
                      
                      }}
                      placeholder="Search company..."
                      isClearable={true}
                    />
                  </div>
                </div>
              </div>

              <div className="form-footer flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-warning"
                  onClick={() => {
                    setActiveTab("all");
                    setSelectedUser(null);
                  }}
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
