/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HeartButton from "../../components/buttons/HeartButton";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import likeReducer from "../../slices/likeSlice";
import * as cookies from "../../utils/cookies";
import { vi, describe, test, expect, beforeEach } from "vitest";
import type { JSX } from "react";

// Mock getCookie
vi.mock("../../utils/cookies", () => ({
  getCookie: vi.fn(),
}));

function renderWithStore(component: JSX.Element) {
  const store = configureStore({
    reducer: { like: likeReducer },
  });
  return render(<Provider store={store}>{component}</Provider>);
}

describe("HeartButton", () => {
  const mockGetCookie = vi.mocked(cookies.getCookie);
  const apiUrl = import.meta.env.VITE_PHOTO_URL || "http://localhost:5074";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("renders button", () => {
    mockGetCookie.mockReturnValue("pet123");

    renderWithStore(<HeartButton otherUserId="user456" />);
    expect(screen.getByLabelText("Like this profile")).toBeInTheDocument();
  });

  test("shows alert if petProfileId or otherUserId is missing", async () => {
    mockGetCookie.mockReturnValue(null);

    renderWithStore(<HeartButton otherUserId="user456" />);
    fireEvent.click(screen.getByLabelText("Like this profile"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Missing account info.");
    });
  });

  test("calls API and updates state on success with match", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        match: true,
        likedUsers: ["a", "b"],
        likedByUsers: ["x", "y"],
      }),
    });

    const onHeartSuccess = vi.fn();

    renderWithStore(
      <HeartButton otherUserId="user456" onHeartSuccess={onHeartSuccess} />
    );

    fireEvent.click(screen.getByLabelText("Like this profile"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        `${apiUrl}/api/users/pet123/like/user456`,
        { method: "PUT" }
      );

      expect(window.alert).toHaveBeenCalledWith("🎉 It's a match!");
      expect(onHeartSuccess).toHaveBeenCalled();
    });
  });

  test("handles non-match response gracefully", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        match: false,
        likedUsers: ["a"],
        likedByUsers: ["b"],
      }),
    });

    renderWithStore(<HeartButton otherUserId="user456" />);

    fireEvent.click(screen.getByLabelText("Like this profile"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("You liked this profile");
    });
  });

  test("handles fetch error", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error("Network fail"));

    renderWithStore(<HeartButton otherUserId="user456" />);

    fireEvent.click(screen.getByLabelText("Like this profile"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("An error occurred.");
    });
  });

  test("handles non-ok response", async () => {
    mockGetCookie.mockReturnValue("pet123");

    globalThis.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
    });

    renderWithStore(<HeartButton otherUserId="user456" />);

    fireEvent.click(screen.getByLabelText("Like this profile"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Failed to like.");
    });
  });
});
