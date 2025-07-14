// src/__tests__/SwipePage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SwipePage from "../../pages/explore/SwipePage";

// Mock components
vi.mock("../../components/layout/Header", () => ({
  default: () => <div>MockHeader</div>,
}));
vi.mock("../../components/layout/Footer", () => ({
  default: () => <div>MockFooter</div>,
}));
vi.mock("../../components/cards/PetCard", () => ({
  default: (props: any) => <div>MockPetCard - {props.name}</div>,
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SwipePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("accountId", "account-123");
    localStorage.setItem("petProfileId", "pet-123");
  });

  it("redirects to home if accountId or petProfileId is missing", async () => {
    localStorage.removeItem("accountId");
    render(
      <MemoryRouter>
        <SwipePage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("renders a pet and handles skip", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedUserIds: [] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          users: [
            { id: "pet-111", name: "Buddy" },
            { id: "pet-123", name: "Myself" }, // will be filtered out
          ],
        }),
      });

    render(
      <MemoryRouter>
        <SwipePage />
      </MemoryRouter>
    );

    // Wait for pet to render
    expect(await screen.findByText(/MockPetCard - Buddy/)).toBeInTheDocument();

    // Click skip
    fireEvent.click(screen.getByText("Skip"));

    // It should show no more pets after skipping the only one
    await waitFor(() => {
      expect(screen.getByText("No more pets to show.")).toBeInTheDocument();
    });
  });

  it("renders empty message if all pets are filtered", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ likedUserIds: ["pet-111"] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ users: [{ id: "pet-111", name: "Skipped" }] }),
      });

    render(
      <MemoryRouter>
        <SwipePage />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("No more pets to show.")
    ).toBeInTheDocument();
  });
});
