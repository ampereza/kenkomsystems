
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/AuthProvider";
import Login from "@/pages/authentication/login";
import AddUser from "@/pages/authentication/adduser";
import RemoveUser from "@/pages/authentication/removeuser";
import { EmailConfirmationHandler } from "@/components/auth/EmailConfirmationHandler";
import Unauthorized from "@/pages/Unauthorized";

export const AuthRoutes = () => {
  return (
    <>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/email-confirmation" element={<EmailConfirmationHandler />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Admin routes */}
      <Route path="/admin/add-user" element={
        <ProtectedRoute allowedRoles={["managing_director"]}>
          <AddUser />
        </ProtectedRoute>
      } />
      <Route path="/admin/remove-user" element={
        <ProtectedRoute allowedRoles={["managing_director"]}>
          <RemoveUser />
        </ProtectedRoute>
      } />
    </>
  );
};

