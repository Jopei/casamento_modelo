import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { admin, ready } = useAdminAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <span className="font-script text-3xl text-gold">Carregando...</span>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
