"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); }
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-rose-500 mb-1">💕 RomindMe</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}
            className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300" required />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
            className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl py-2.5 text-sm transition">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          No account? <Link href="/register" className="text-rose-400 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}
