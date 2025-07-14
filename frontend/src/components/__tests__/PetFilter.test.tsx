/// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import PetFilter from "../filters/PetFilter";

describe("PetFilter", () => {
  const defaultFilters = {
    petType: "",
    location: "",
    minAge: "",
    maxAge: "",
  };

  test("renders filter fields", () => {
    const mockSetFilters = vi.fn();

    render(<PetFilter filters={defaultFilters} setFilters={mockSetFilters} />);

    expect(screen.getByText("Filter Options")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Min Age")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max Age")).toBeInTheDocument();
  });

  test("updates pet type", () => {
    const mockSetFilters = vi.fn();

    render(<PetFilter filters={defaultFilters} setFilters={mockSetFilters} />);
    fireEvent.change(screen.getByDisplayValue("All Types"), {
      target: { value: "Dog" },
    });

    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
  });

  test("updates location", () => {
    const mockSetFilters = vi.fn();

    render(<PetFilter filters={defaultFilters} setFilters={mockSetFilters} />);
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Auckland" },
    });

    expect(mockSetFilters).toHaveBeenCalledWith(expect.any(Function));
  });

  test("updates min and max age", () => {
    const mockSetFilters = vi.fn();

    render(<PetFilter filters={defaultFilters} setFilters={mockSetFilters} />);
    fireEvent.change(screen.getByPlaceholderText("Min Age"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByPlaceholderText("Max Age"), {
      target: { value: "10" },
    });

    expect(mockSetFilters).toHaveBeenCalledTimes(2);
  });
});
