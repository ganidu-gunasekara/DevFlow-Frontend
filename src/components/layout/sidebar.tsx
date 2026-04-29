import { useRouter, usePathname } from "next/navigation";
import { Users, Building2, FolderKanban, LayoutDashboard } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Users",     path: "/users",     icon: Users },
  { label: "Company",   path: "/company",   icon: Building2 },
  { label: "Project",   path: "/project",   icon: FolderKanban },
];

export function SideBar() {
  const router   = useRouter();
  const pathname = usePathname();

  return (
    <div className="sidebar">
      {/* Logo area */}
      <div className="sidebar-logo-area">
        <div className="sidebar-logo-box" />
        <span className="sidebar-brand-label">Workspace</span>
      </div>

      {/* Section label */}
      <div className="sidebar-section-label">Navigation</div>

      {/* Nav items */}
      {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
        const isActive = pathname === path;
        return (
          <div
            key={label}
            className={`sidebar-item${isActive ? " sidebar-item--active" : ""}`}
            onClick={() => router.push(path)}
          >
            {isActive && <span className="sidebar-active-indicator" />}
            <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
