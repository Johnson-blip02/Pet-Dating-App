// src/pages/account/LoginPage.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch from react-redux
import { login, setPetProfileId } from "../../slices/authSlice"; // Import the login and setPetProfileId actions
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookies";
import InputField from "../../components/form/InputField"; // Reused input component
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch to trigger actions

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5074/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();

      const accountRes = await fetch(
        `http://localhost:5074/api/accounts/${data.id}`
      );
      if (!accountRes.ok) throw new Error("Failed to fetch account details");

      const account = await accountRes.json();

      // Set cookies and localStorage for persistence across sessions
      setCookie("accountId", data.id);
      setCookie("petProfileId", account.petProfileId);

      localStorage.setItem("accountId", data.id);
      localStorage.setItem("petProfileId", account.petProfileId);

      // Dispatch the login action to Redux to update the accountId in Redux store
      dispatch(login(data.id)); // Set accountId in Redux
      dispatch(setPetProfileId(account.petProfileId)); // Set petProfileId in Redux

      navigate("/user-profile"); // Navigate to explore after login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <InputField
              label="Email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
