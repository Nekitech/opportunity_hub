import { useState } from "react";
import { useRouter } from "next/router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navItems } from "./config";
import { SidebarNav } from "./sidebar-nav";
import { AccountMenu } from "./account-menu";

function useCurrentTitle() {
  const router = useRouter();
  const path = router.pathname;
  const match = navItems.find(
    (i) => i.path === path || (i.path !== "/" && path.startsWith(i.path))
  );
  return match?.title ?? "Админ-панель";
}

export const TopNav = () => {
  const [open, setOpen] = useState(false);
  const title = useCurrentTitle();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md lg:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Открыть меню"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 border-0 p-0">
          <SheetTitle className="sr-only">Навигация</SheetTitle>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>

      <div className="ml-auto flex items-center gap-2">
        <AccountMenu />
      </div>
    </header>
  );
};
