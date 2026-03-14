import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

export function SideBar() {
  const titles  = {
    User: "/users",
    Company: "/companies",
    Project: "/projects",
  };
  const router = useRouter();
  return (
    <div className="sidebar">
      {(Object.keys(titles)as Array<keyof typeof titles>).map((title) => (
        <div key={title} className="sidebar-item" onClick={() => router.push(titles[title])}>
          {title}
        </div>
      ))}
    </div>
  );
}
