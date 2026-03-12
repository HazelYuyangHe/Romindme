"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); }
    else router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-rose-500 mb-1">💕 RomindMe</h1>
        <p className="text-gray-400 text-sm mb-6">Create your account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
            className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300" />
          <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
            className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300" required />
          <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}
            className="w-full border border-rose-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-rose-300" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white font-semibold rounded-xl py-2.5 text-sm transition">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          Have an account? <Link href="/login" className="text-rose-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
