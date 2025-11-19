// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Temporarily disabled auth checks for debugging
  return <>{children}</>;
};
