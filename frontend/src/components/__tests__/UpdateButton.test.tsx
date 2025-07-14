/// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, type Mock } from "vitest";
import UpdateButton from "../buttons/UpdateButton";
import { MemoryRouter, useNavigate } from "react-router-dom";

// Mock useNavigate with proper typing
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("UpdateButton", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  test("renders Update Profile button with correct text", () => {
    render(
      <MemoryRouter>
        <UpdateButton petProfileId="abc123" />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /update profile/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Update Profile");
    expect(button).toBeEnabled(); // Button should always be enabled
  });

  test("navigates to profile update page when clicked", () => {
    render(
      <MemoryRouter>
        <UpdateButton petProfileId="abc123" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Update Profile"));
    expect(mockNavigate).toHaveBeenCalledWith("/profile-update/abc123");
  });
});
