import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import Aurora from "../components/Aurora";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err, "Registration failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Aurora />
      <form onSubmit={submit} className="solid card w-full max-w-md p-8">
        <div className="btn-brand flex h-11 w-11 items-center justify-center text-2xl">◈</div>
        <h1 className="mt-3 text-2xl font-extrabold">Start your flight</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          One account. One profile. One public link to rule them all.
        </p>
        {error && (
          <p className="mt-3 rounded-lg p-2.5 text-sm" style={{ background: "var(--chip)", color: "var(--danger)" }}>
            {error}
          </p>
        )}
        <label className="label mt-4 block" htmlFor="name">Full name</label>
        <input id="name" className="input mt-1" required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Asha Sharma" />
        <label className="label mt-3 block" htmlFor="email">Email</label>
        <input id="email" className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
        <label className="label mt-3 block" htmlFor="password">Password (8+ chars)</label>
        <input id="password" className="input mt-1" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <button type="submit" disabled={busy} className="btn-brand mt-5 w-full py-2.5">
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
          Have an account? <Link to="/login" className="font-semibold underline" style={{ color: "var(--brand)" }}>Login</Link>
        </p>
      </form>
    </div>
  );
}
