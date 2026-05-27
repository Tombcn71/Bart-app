"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/app/actions";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await adminLogin(password);
    if (result.success) {
      router.push("/");
    } else {
      setError("Ongeldig wachtwoord");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-black text-slate-800 mb-1">Welkom terug, Bart</h1>
        <p className="text-sm text-slate-400 mb-6">Vul je wachtwoord in om verder te gaan.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2.5 rounded-lg text-sm mt-1"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1066a3] text-white py-3 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-[#0d5282] transition-colors">
            {loading ? "Bezig..." : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
