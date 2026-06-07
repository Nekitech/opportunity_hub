import type { ComponentType } from "react";
import { AuthGuard } from "@/guards/auth-guard";

export const withAuthGuard = <P extends object>(Component: ComponentType<P>) => {
  const Guarded = (props: P) => (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );
  Guarded.displayName = `withAuthGuard(${Component.displayName ?? Component.name ?? "Component"})`;
  return Guarded;
};
