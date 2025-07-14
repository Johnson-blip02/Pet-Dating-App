/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Header from "../layout/Header";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import * as reduxHooks from "react-redux";
import * as cookieUtils from "../../utils/cookies";
import * as logoutUtils from "../../utils/logout";

// Mock Redux hooks
vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof reduxHooks>("react-redux");
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(() => vi.fn()),
  };
});

// Mock react-router-dom hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({ pathname: "/" })),
  };
});

describe("Header component", () => {
  const useSelectorMock = vi.mocked(reduxHooks.useSelector);
  const useDispatchMock = vi.mocked(reduxHooks.useDispatch);
  const useNavigateMock = vi.mocked(useNavigate);
  const getCookieMock = vi.spyOn(cookieUtils, "getCookie");
  const logoutMock = vi.spyOn(logoutUtils, "logoutUser");

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatchMock.mockReturnValue(vi.fn());
    useNavigateMock.mockReturnValue(vi.fn());
  });

  it("renders logo and basic navigation", () => {
    useSelectorMock.mockImplementation((cb) =>
      cb({
        auth: { accountId: null, petProfileId: null },
        theme: { mode: "light" },
      })
    );

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("PetMatch")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows navigation links when logged in with complete profile", async () => {
    useSelectorMock.mockImplementation((cb) =>
      cb({
        auth: { accountId: "123", petProfileId: "456" },
        theme: { mode: "light" },
      })
    );

    getCookieMock.mockImplementation((key) =>
      key === "accountId" ? "123" : key === "petProfileId" ? "456" : null
    );

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ role: "User" }),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Explore")).toBeInTheDocument();
      expect(screen.getByText("Likes")).toBeInTheDocument();
      expect(screen.getByText("Messenger")).toBeInTheDocument();
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });
  });

  it("handles logout correctly", async () => {
    const mockNavigate = vi.fn();
    useNavigateMock.mockReturnValue(mockNavigate);

    useSelectorMock.mockImplementation((cb) =>
      cb({
        auth: { accountId: "123", petProfileId: "456" },
        theme: { mode: "light" },
      })
    );

    getCookieMock.mockReturnValue("123");
    logoutMock.mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText("Logout"));

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
