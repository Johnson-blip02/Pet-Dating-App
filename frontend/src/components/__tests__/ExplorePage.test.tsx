/// <reference types="vitest" />
import { render, screen, waitFor } from "@testing-library/react";
import ExplorePage from "../../pages/explore/ExplorePage";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// Global fetch mock
global.fetch = vi.fn();

vi.mock("../../components/layout/Header", () => ({
  default: () => <div>MockHeader</div>,
}));
vi.mock("../../components/layout/Footer", () => ({
  default: () => <div>MockFooter</div>,
}));
vi.mock("../../components/filters/PetFilter", () => ({
  default: () => <div>MockFilter</div>,
}));
vi.mock("../../components/navigation/Pagination", () => ({
  default: () => <div>MockPagination</div>,
}));

// ✅ PetCard mock expects `userName` from props
vi.mock("../../components/cards/PetCard", () => ({
  default: (props: any) => (
    <div data-testid={`pet-card-${props.id}`}>{props.userName}</div>
  ),
}));

describe("ExplorePage", () => {
  beforeEach(() => {
    localStorage.setItem("accountId", "123");
    localStorage.setItem("petProfileId", "own-pet");

    (fetch as any).mockImplementation((url: string) => {
      if (url.includes("/accounts/123")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ petProfileId: "own-pet" }),
        });
      }
      if (url.includes("/users")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              users: [
                { id: "pet-1", userName: "Fluffy" },
                { id: "own-pet", userName: "Self" },
              ],
              totalCount: 2,
            }),
        });
      }
    });
  });

  it("renders pet cards excluding user's own pet", async () => {
    render(
      <MemoryRouter>
        <ExplorePage />
      </MemoryRouter>
    );

    expect(screen.getByText("MockHeader")).toBeInTheDocument();
    expect(screen.getByText("MockFilter")).toBeInTheDocument();

    await waitFor(() => {
      // ✅ Fluffy should be rendered
      expect(screen.getByText("Fluffy")).toBeInTheDocument();
      expect(screen.getByTestId("pet-card-pet-1")).toBeInTheDocument();

      //"Self" (own pet) should not be rendered
      expect(screen.queryByText("Self")).not.toBeInTheDocument();
      expect(screen.queryByTestId("pet-card-own-pet")).not.toBeInTheDocument();
    });

    expect(screen.getByText("MockPagination")).toBeInTheDocument();
    expect(screen.getByText("MockFooter")).toBeInTheDocument();
  });
});
