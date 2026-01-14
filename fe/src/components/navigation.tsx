"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Trophy,
  Flame,
  LayoutDashboard,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { useUserStore } from "@/stores/user-store";
import { useAuthStore } from "@/stores/auth-store";
import { authService } from "@/services";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/courses", label: "Courses", icon: BookOpen, exact: false },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, exact: true },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  const { isAuthenticated, username, logout } = useAuthStore();

  const handleLogout = () => {
    authService.logout();
    logout();
    router.push("/login");
  };

  // Don't show navigation on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="mx-auto max-w-6xl bg-card/80 backdrop-blur-lg border rounded-2xl shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block">
              FlashLearn
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(item.href + "/") || pathname.startsWith("/study");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block text-sm font-medium">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Streak Badge */}
            {user && user.currentStreak > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-streak/10 text-streak">
                <Flame className="h-4 w-4 animate-flame" />
                <span className="text-sm font-bold">{user.currentStreak}</span>
              </div>
            )}

            {/* XP Badge */}
            {user && (
              <Badge variant="xp" className="hidden sm:flex">
                Lv.{user.level}
              </Badge>
            )}

            <ThemeToggle />

            {/* User Avatar */}
            {isAuthenticated && (
              <Avatar className="h-9 w-9 ring-2 ring-primary/20 cursor-pointer hover:ring-primary/50 transition-all">
                <AvatarImage
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`}
                  alt={user?.username || username || "User"}
                />
                <AvatarFallback>
                  {(user?.username || username || "U")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            {/* Logout Button */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
