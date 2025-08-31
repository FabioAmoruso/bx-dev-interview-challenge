import { Navigate } from "react-router-dom";
import authService from "../services/auth.service";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
