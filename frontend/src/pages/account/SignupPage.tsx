// src/pages/account/SignupPage.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch to dispatch actions
import { login, setPetProfileId } from "../../slices/authSlice"; // Import actions
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookies";
import InputField from "../../components/form/InputField"; // Reused input component
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

// Define the ErrorResponse interface
interface ErrorResponse {
  message?: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch to trigger actions

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsProcessing(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsProcessing(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5074/api/accounts/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setCookie("accountId", data.id);
        localStorage.setItem("accountId", data.id);

        // Dispatch Redux actions to set accountId and petProfileId
        dispatch(login(data.id)); // Set accountId in Redux
        dispatch(setPetProfileId(null)); // Set petProfileId as null (or set to an actual value once it's available)

        navigate("/profile-creation");
        // isProcessing remains true during navigation
      } else {
        // Handle API errors
        let errorData: ErrorResponse = {}; // Define the errorData as ErrorResponse
        try {
          errorData = await res.json();
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
        setError(errorData.message || "Registration failed");
        setIsProcessing(false);
      }
    } catch (err) {
      // Handle network errors
      console.error("Signup error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow"
        >
          <h2 className="text-2xl font-bold">Sign Up</h2>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isProcessing}
          >
            Register
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
