import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookies"; // Import the new cookie utility

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5074/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();

      // Fetch account to get petProfileId
      const accountRes = await fetch(
        `http://localhost:5074/api/accounts/${data.id}`
      );
      if (!accountRes.ok) {
        throw new Error("Failed to fetch account details");
      }

      const account = await accountRes.json();

      // Set cookies using the new utility
      setCookie("accountId", data.id);
      setCookie("petProfileId", account.petProfileId);

      // Store in localStorage if needed (optional)
      localStorage.setItem("accountId", data.id);
      localStorage.setItem("petProfileId", account.petProfileId);

      navigate("/explore");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
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
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
