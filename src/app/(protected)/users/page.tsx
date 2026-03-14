"use client";
import MainTable from "@/src/components/ui/MainTable";
import { getUsers } from "@/src/lib/user/userApi";
import { useEffect, useRef, useState } from "react";

export default function User() {
  interface User {
    id: number;
    [key: string]: any;
  }
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    type: "",
    company: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [activeTab, setActiveTab] = useState<"all" | "new">("all");
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "action", header: "Action" },
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
              <div className="flex flex-1 flex-col gap-4 bg-surface p-6 rounded shadow overflow-y-auto ">
                {/* Email */}
                <div className="flex flex-col gap-1">
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

                {/* Name */}
                <div className="flex flex-col gap-1">
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

                {/* Password */}
                <div className="flex flex-col gap-1">
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

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                  <label className="label">Confirm Password</label>
                  <input
                    className="input-text"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  {/* password mismatch warning */}
                  {formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <span className="text-xs text-red-500">
                        Passwords do not match
                      </span>
                    )}
                </div>

                {/* User Type */}
                <div className="flex flex-col gap-1">
                  <label className="label">User Type</label>
                  <select
                    className="input-text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="DEVELOPER">Developer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-1">
                  <label className="label">Company</label>
                  <select
                    className="input-text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  >
                    <option value="">Select Company</option>
                    {/* populate from API later */}
                  </select>
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
