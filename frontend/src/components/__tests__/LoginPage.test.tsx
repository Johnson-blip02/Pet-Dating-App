/// <reference types="vitest" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../pages/account/LoginPage";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../slices/authSlice";

// Mocks
beforeEach(() => {
  global.fetch = vi.fn();
});

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

// Test Store
const createTestStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe("LoginPage", () => {
  it("logs in and updates Redux state", async () => {
    const store = createTestStore();

    // Mock login response
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "test123" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ petProfileId: "pet456" }),
      });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    // Fill inputs
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Log In"));

    await waitFor(() => {
      const state = store.getState().auth;
      expect(state.accountId).toBe("test123");
      expect(state.petProfileId).toBe("pet456");
    });
  });
});
