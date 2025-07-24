/// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
import FormInput from "../../components/profileCreation/FormInput";
import { describe, it, expect, vi } from "vitest";

describe("FormInput", () => {
  it("renders label and input with helper text", () => {
    render(
      <FormInput
        id="userName"
        name="userName"
        label="Pet Name"
        type="text"
        value="Buddy"
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByLabelText("Pet Name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Buddy")).toBeInTheDocument();
    expect(
      screen.getByText("Must be between 2 and 50 characters.")
    ).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const mockChange = vi.fn();

    render(
      <FormInput
        id="location"
        name="location"
        label="Location"
        type="text"
        value=""
        onChange={mockChange}
        required
      />
    );

    const input = screen.getByLabelText("Location");
    fireEvent.change(input, { target: { value: "Auckland" } });

    expect(mockChange).toHaveBeenCalled();
  });

  it("does not render helper text for unknown field", () => {
    render(
      <FormInput
        id="unknown"
        name="unknown"
        label="Other"
        type="text"
        value=""
        onChange={() => {}}
      />
    );

    expect(
      screen.queryByText(/Must be|Enter a|Required/)
    ).not.toBeInTheDocument();
  });
});
