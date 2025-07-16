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
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL;

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
      // First, check if the email is already registered
      const emailCheckRes = await fetch(`${apiUrl}/accounts/email/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!emailCheckRes.ok) {
        // If email is already registered, alert the user
        const emailCheckData = await emailCheckRes.json();
        if (emailCheckData.message === "Email already registered.") {
          setError("This email is already in use. Please choose another.");
          setIsProcessing(false);
          return;
        }
      }

      // Proceed with the registration
      const res = await fetch(`${apiUrl}/accounts/register`, {
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
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />

      <main className="flex-grow flex items-center justify-center px-4 bg-light-background dark:bg-dark-background">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md space-y-4 p-6 rounded shadow bg-white dark:bg-gray-900"
        >
          <h2 className="text-2xl font-bold">Sign Up</h2>

          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

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
            className="w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black p-2 rounded hover:bg-yellow-500 dark:hover:bg-yellow-600 disabled:opacity-50 transition"
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
