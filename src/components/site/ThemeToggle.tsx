import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sultan-haramain-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", nextDark);
    setDark(nextDark);
  }, []);

  function toggleTheme() {
    const nextDark = !dark;
    document.documentElement.classList.toggle("dark", nextDark);
    window.localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light");
    setDark(nextDark);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Aktifkan Light Mode" : "Aktifkan Dark Mode"}
      title={dark ? "Light Mode" : "Dark Mode"}
      className="fixed bottom-24 right-5 z-[60] inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-deep backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
