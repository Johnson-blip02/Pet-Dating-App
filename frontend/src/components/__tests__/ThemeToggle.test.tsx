// src/components/__tests__/ThemeToggle.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { beforeEach, describe, expect, test } from "vitest";
import ThemeToggle from "../buttons/ThemeToggle";
import themeReducer from "../../slices/themeSlice";

// Helper to render with Redux store
function renderWithStore(initialMode: "light" | "dark" = "light") {
  const store = configureStore({
    reducer: {
      theme: themeReducer,
    },
    preloadedState: {
      theme: { mode: initialMode },
    },
  });

  render(
    <Provider store={store}>
      <ThemeToggle />
    </Provider>
  );

  return store;
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  test("shows correct icon for light mode", () => {
    renderWithStore("light");
    expect(screen.getByLabelText("Switch to dark mode")).toBeInTheDocument();
  });

  test("shows correct icon for dark mode", () => {
    renderWithStore("dark");
    expect(screen.getByLabelText("Switch to light mode")).toBeInTheDocument();
  });

  test("dispatches toggleTheme, updates class and localStorage on click", () => {
    const store = renderWithStore("light");

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Confirm action was dispatched
    const actions = store.getState().theme;
    expect(actions.mode).toBe("dark");

    // Confirm dark mode class was applied
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Confirm localStorage was updated
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
