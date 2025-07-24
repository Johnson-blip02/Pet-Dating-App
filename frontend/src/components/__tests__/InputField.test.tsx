/// <reference types="vitest" />
import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "../../components/form/InputField";
import { describe, it, expect, vi } from "vitest";

describe("InputField", () => {
  it("renders label and input", () => {
    render(
      <InputField
        label="Username"
        name="username"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const mockChange = vi.fn();

    render(
      <InputField
        label="Email"
        name="email"
        value=""
        onChange={mockChange}
        type="email"
        placeholder="Enter email"
        required
      />
    );

    const input = screen.getByPlaceholderText("Enter email");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(mockChange).toHaveBeenCalled();
  });
});
