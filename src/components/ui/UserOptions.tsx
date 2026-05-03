import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCurrentProjectStore } from "@/src/lib/project/projectStore";
import { useAuthStore } from "@/src/lib/auth/authStore";
import { logoutUser } from "@/src/lib/auth/authApi";

export default function UserOptions() {
  const router = useRouter();
  const logout = async () => {
    try {
      const data = await logoutUser();
      useCurrentProjectStore.getState().clearCurrentProject();
      useAuthStore.getState().clearAuth();
      router.push("/sign-in");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 w-40">
      <div className="px-3 py-2 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800">
        User Profile
      </div>
      <button onClick={logout} className="px-3 py-2 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 text-red-500">
        Logout
      </button>
    </div>
  );
}
