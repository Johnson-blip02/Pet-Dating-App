// src/pages/account/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setAccountId } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5074/api/accounts/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      document.cookie = `accountId=${data.id}; path=/`;
      setAccountId(data.id);
      navigate("/profile-creation");
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* 👇 This container allows form to grow and push footer down */}
      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow"
        >
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
