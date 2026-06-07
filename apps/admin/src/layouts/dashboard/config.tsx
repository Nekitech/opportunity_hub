import {
  Archive,
  BarChart3,
  Bug,
  FileText,
  GraduationCap,
  LayoutDashboard,
  ScrollText,
  Settings,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  path: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { title: "Дашборд", path: "/", icon: LayoutDashboard },
  { title: "Пользователи", path: "/customers", icon: Users },
  { title: "Парсеры", path: "/parsers", icon: Bug },
  { title: "Статистика источников", path: "/source-stats", icon: BarChart3 },
  { title: "Гранты", path: "/grants", icon: FileText },
  { title: "Конкурсы", path: "/competitions", icon: Trophy },
  { title: "Стажировки", path: "/internships", icon: GraduationCap },
  { title: "Архив", path: "/archive", icon: Archive },
  { title: "Настройки", path: "/settings", icon: Settings },
  { title: "Логи", path: "/logs", icon: ScrollText },
];
