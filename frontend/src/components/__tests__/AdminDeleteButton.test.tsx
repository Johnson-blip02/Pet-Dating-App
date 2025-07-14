/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDeleteButton from "../buttons/AdminDeleteButton";
import { beforeEach, describe, expect, test, vi, type Mock } from "vitest";
import { useNavigate } from "react-router-dom";

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
    vi.spyOn(window, "confirm").mockReturnValue(false); // User cancels

    // 👇 This is the fix: spy on fetch even if we expect it not to be called
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<AdminDeleteButton userId="test-id" />);
    fireEvent.click(screen.getByLabelText("Permanently delete account"));

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    fetchSpy.mockRestore(); // ✅ Optional: clean up after the test
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
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:5074/api/accounts/user/test-id"
      );
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "http://localhost:5074/api/accounts/account-123",
        expect.objectContaining({ method: "DELETE" })
      );
      expect(onDeleteSuccess).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/admin", {
        state: { accountDeleted: true },
      });
    });
  });
});
