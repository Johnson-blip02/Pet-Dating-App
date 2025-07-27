/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDeleteButton from "../buttons/AdminDeleteButton";
import { beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import { useNavigate } from "react-router-dom";

// ✅ Define your backend URL here (matches your environment config)
const apiUrl = import.meta.env.VITE_PHOTO_URL || "http://localhost:5074";

// Mock useNavigate
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("AdminDeleteButton", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  test("renders button with correct label", () => {
    render(<AdminDeleteButton userId="test-id" />);
    expect(
      screen.getByLabelText("Permanently delete account")
    ).toBeInTheDocument();
  });

  test("cancels deletion if user clicks 'Cancel'", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<AdminDeleteButton userId="test-id" />);
    fireEvent.click(screen.getByLabelText("Permanently delete account"));

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });

  test("completes full delete flow successfully", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);

    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "account-123" }),
      })
      .mockResolvedValueOnce({ ok: true });

    const onDeleteSuccess = vi.fn();

    render(
      <AdminDeleteButton userId="test-id" onDeleteSuccess={onDeleteSuccess} />
    );

    fireEvent.click(screen.getByLabelText("Permanently delete account"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);

      // ✅ Ensure it targets your Render URL correctly
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${apiUrl}/api/accounts/user/test-id`
      );
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${apiUrl}/api/accounts/account-123`,
        expect.objectContaining({
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );

      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });
});
