
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password must contain at least one uppercase and one lowercase letter.");
      return;
    }

    setLoading(true);

    try {
     const signUpData = {
  name,
  email,
  password,
  role,
};

const result = await authClient.signUp.email(signUpData);

      if (result.error) {
        setError(result.error.message || "Could not create your account.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-[#EDE8E0]">
        <div className="mb-8 text-center">
          <Link href="/" className="text-3xl font-bold text-[#8B6B4A]">
            WedPlan
          </Link>

          <h1 className="mt-6 text-2xl font-semibold text-[#292524]">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join WedPlan and start planning your wedding journey.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#8B6B4A]"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#8B6B4A]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#8B6B4A]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Include at least one uppercase and one lowercase letter.
            </p>
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
              I want to join as
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#8B6B4A]"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#8B6B4A] px-4 py-3 font-medium text-white transition hover:bg-[#725638] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-[#8B6B4A] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
