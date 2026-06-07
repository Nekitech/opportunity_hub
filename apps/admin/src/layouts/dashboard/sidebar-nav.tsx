import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { navItems } from "./config";

function isActive(current: string, path: string) {
  if (path === "/") return current === "/";
  return current === path || current.startsWith(`${path}/`);
}

export const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const router = useRouter();
  const current = router.pathname;

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 items-center gap-3 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/15 text-brand-400">
          <span className="h-5 w-5">
            <Logo />
          </span>
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">Opportunity Hub</p>
          <p className="text-xs text-slate-400">Админ-панель</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const active = isActive(current, item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white shadow-soft"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-white"
                )}
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 px-6 py-4">
        <p className="text-xs text-slate-500">© Opportunity Hub</p>
      </div>
    </div>
  );
};
