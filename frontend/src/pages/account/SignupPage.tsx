import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { setCookie } from "../../utils/cookies";
import InputField from "../../components/form/InputField";

interface ErrorResponse {
  message?: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { setAccountId } = useAuth();

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
        setAccountId(data.id);
        navigate("/profile-creation");
        // isProcessing remains true during navigation
      } else {
        // Handle API errors
        let errorData: ErrorResponse = {};
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

  // // Loading screen overlay
  // if (isProcessing) {
  //   return (
  //     <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
  //       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
  //       <p className="mt-4 text-lg font-medium">Creating your account...</p>
  //     </div>
  //   );
  // }

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
