// src/components/ThemeToggle.tsx
import { useDispatch, useSelector } from "react-redux";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { toggleTheme } from "../../slices/themeSlice";
import type { RootState } from "../../store";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const handleToggle = () => {
    dispatch(toggleTheme()); // Toggle theme in Redux
    const newMode = mode === "dark" ? "light" : "dark"; // Get the new mode after toggle

    // Apply the new mode to the html element
    document.documentElement.classList.toggle("dark", newMode === "dark");

    // Optionally, save the new theme to localStorage to persist between sessions
    localStorage.setItem("theme", newMode);
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={
        mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      aria-live="polite"
    >
      {mode === "dark" ? (
        <SunIcon className="h-6 w-6 text-white" /> // Icon for dark mode
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" /> // Icon for light mode
      )}
    </button>
  );
}
