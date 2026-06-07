import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";

export const useAuth = (): AuthContextValue => useContext(AuthContext);
