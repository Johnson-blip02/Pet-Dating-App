// src/components/ThemeProvider.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "../slices/themeSlice"; // Adjust the path if needed
import type { AppDispatch } from "../store";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check for saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : systemPrefersDark
        ? "dark"
        : "light";

    dispatch(setTheme(initialTheme)); // Set the theme in Redux
    document.documentElement.classList.toggle("dark", initialTheme === "dark"); // Apply dark mode class on html
  }, [dispatch]);

  return <>{children}</>; // Render the child components
}
