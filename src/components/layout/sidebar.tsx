import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

export function SideBar() {
  const titles  = {
    User: "/users",
    Company: "/company",
    Project: "/project",
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
