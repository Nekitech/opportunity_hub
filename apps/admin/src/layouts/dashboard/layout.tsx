import type { ReactNode } from "react";
import { withAuthGuard } from "@/hocs/with-auth-guard";
import { SidebarNav } from "./sidebar-nav";
import { TopNav } from "./top-nav";

export const Layout = withAuthGuard(({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <TopNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
});
