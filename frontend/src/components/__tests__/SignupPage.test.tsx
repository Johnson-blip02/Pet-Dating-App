/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "../../pages/account/SignupPage";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../slices/authSlice";

// Mock fetch globally
beforeEach(() => {
  global.fetch = vi.fn();
});

// Mock components with proper label associations
vi.mock("../../components/layout/Header", () => ({
  default: () => <div>MockHeader</div>,
}));

vi.mock("../../components/layout/Footer", () => ({
  default: () => <div>MockFooter</div>,
}));

vi.mock("../../components/form/InputField", () => ({
  default: ({ label, name, ...props }: any) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
    </div>
  ),
}));

vi.mock("../../utils/cookies", () => ({
  setCookie: vi.fn(),
}));

// Setup test store
const createTestStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe("SignupPage", () => {
  it("renders form and submits successfully", async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true }) // Email check
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test123" }),
      });

    const store = createTestStore();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignupPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("MockHeader")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.accountId).toBe("test123");
    });
  });
});
