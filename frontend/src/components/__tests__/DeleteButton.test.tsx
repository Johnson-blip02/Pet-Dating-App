/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteButton from "../buttons/DeleteButton";
import { useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi, describe, test, expect, beforeEach, type Mock } from "vitest";
import themeReducer from "../../slices/themeSlice";
import * as logoutModule from "../../utils/logout";
import type { JSX } from "react";

// Mock navigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock logoutUser
vi.mock("../../utils/logout", () => ({
  logoutUser: vi.fn(),
}));

function renderWithStore(component: JSX.Element) {
  const store = configureStore({
    reducer: { theme: themeReducer },
  });
  return render(<Provider store={store}>{component}</Provider>);
}

describe("DeleteButton", () => {
  const mockNavigate = vi.fn();
  const mockLogout = vi.mocked(logoutModule.logoutUser);

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  test("renders delete button", () => {
    renderWithStore(<DeleteButton accountId="acc-123" />);
    expect(
      screen.getByLabelText("Permanently delete account")
    ).toBeInTheDocument();
  });

  test("cancels deletion if user clicks 'Cancel'", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    renderWithStore(<DeleteButton accountId="acc-123" />);
    fireEvent.click(screen.getByLabelText("Permanently delete account"));

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(mockLogout).not.toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });

  test("deletes account, logs out and redirects", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: true });

    const onDeleteSuccess = vi.fn();

    renderWithStore(
      <DeleteButton accountId="acc-123" onDeleteSuccess={onDeleteSuccess} />
    );

    fireEvent.click(screen.getByLabelText("Permanently delete account"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:5074/api/accounts/acc-123",
        expect.objectContaining({ method: "DELETE" })
      );
      expect(mockLogout).toHaveBeenCalled();
      expect(onDeleteSuccess).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/", {
        state: { accountDeleted: true },
      });
    });
  });
});
