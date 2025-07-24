import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, setPetProfileId } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookies";
import InputField from "../../components/form/InputField";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>(""); // 🔸 New state
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5074/api";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(""); // Clear previous error

    try {
      const res = await fetch(`${apiUrl}/accounts/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          setLoginError("Incorrect email or password."); // 🔸 Friendly message
        } else {
          setLoginError("An unexpected error occurred. Please try again.");
        }
        return;
      }

      const data = await res.json();

      const accountRes = await fetch(`${apiUrl}/accounts/${data.id}`);
      if (!accountRes.ok) throw new Error("Failed to fetch account details");

      const account = await accountRes.json();

      setCookie("accountId", data.id);
      setCookie("petProfileId", account.petProfileId);
      localStorage.setItem("accountId", data.id);
      localStorage.setItem("petProfileId", account.petProfileId);

      dispatch(login(data.id));
      dispatch(setPetProfileId(account.petProfileId));

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
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

            {/* 🔸 Display error message if loginError is set */}
            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black py-2 rounded hover:bg-yellow-500 dark:hover:bg-yellow-600 transition ${
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
