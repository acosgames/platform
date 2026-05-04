import { useEffect } from "react";
import { useNavigate } from "react-router";

export function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get the refPath from localStorage
    const refPath = localStorage.getItem("refPath");
    if (refPath && typeof refPath === "string" && refPath.startsWith("/")) {
      navigate(refPath, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen container mx-auto px-2 lg:px-8 xl:px-20">
      <div className="text-lg font-semibold text-slate-700">Redirecting...</div>
    </div>
  );
}
