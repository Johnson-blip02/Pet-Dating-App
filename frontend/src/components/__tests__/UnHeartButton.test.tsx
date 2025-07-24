/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UnHeartButton from "../buttons/UnHeartButton";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import likeReducer from "../../slices/likeSlice";
import * as cookies from "../../utils/cookies";
import { vi, describe, test, expect, beforeEach } from "vitest";
import type { JSX } from "react";

// Set backend URL
const apiUrl = import.meta.env.VITE_PHOTO_URL || "http://localhost:5074";

// Mock getCookie with typing
vi.mock("../../utils/cookies", () => ({
  getCookie: vi.fn(),
}));

function renderWithStore(component: JSX.Element) {
  const store = configureStore({
    reducer: { like: likeReducer },
  });
  return render(<Provider store={store}>{component}</Provider>);
}

describe("UnHeartButton", () => {
  const mockGetCookie = vi.mocked(cookies.getCookie);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  test("renders correctly", () => {
    mockGetCookie.mockReturnValue("pet123");

    renderWithStore(<UnHeartButton otherUserId="user456" />);
    expect(
      screen.getByLabelText("Unheart and delete chat")
    ).toBeInTheDocument();
  });

  test("cancels if user clicks 'Cancel'", async () => {
    mockGetCookie.mockReturnValue("pet123");
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    renderWithStore(<UnHeartButton otherUserId="user456" />);
    fireEvent.click(screen.getByLabelText("Unheart and delete chat"));

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    fetchSpy.mockRestore();
  });

  test("calls API and updates state on success", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const onHeartSuccess = vi.fn();

    renderWithStore(
      <UnHeartButton otherUserId="user456" onHeartSuccess={onHeartSuccess} />
    );

    fireEvent.click(screen.getByLabelText("Unheart and delete chat"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${apiUrl}/api/users/pet123/unheart/user456`,
        {
          method: "PUT",
        }
      );

      expect(window.alert).toHaveBeenCalledWith(
        "User unhearted and chat deleted."
      );
      expect(onHeartSuccess).toHaveBeenCalled();
    });
  });

  test("shows alert on non-ok response", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi.fn().mockResolvedValueOnce({ ok: false });

    renderWithStore(<UnHeartButton otherUserId="user456" />);

    fireEvent.click(screen.getByLabelText("Unheart and delete chat"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to unheart user.");
    });
  });

  test("shows alert on fetch failure", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network error"));

    renderWithStore(<UnHeartButton otherUserId="user456" />);

    fireEvent.click(screen.getByLabelText("Unheart and delete chat"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("An error occurred.");
    });
  });
});
