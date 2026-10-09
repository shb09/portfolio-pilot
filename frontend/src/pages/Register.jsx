import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import AuthLayout from "../components/AuthLayout";

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
    <AuthLayout
      title="Start your flight"
      subtitle="One account. One profile. One public link."
      footer={<>Have an account? <Link to="/login" className="font-bold underline underline-offset-2" style={{ color: "var(--brand)" }}>Login</Link></>}
    >
      <form onSubmit={submit} noValidate={false}>
        {error && (
          <p role="alert" className="mb-3 rounded-md p-2.5 text-[13px] font-medium" style={{ background: "var(--chip)", color: "var(--danger)" }}>
            {error}
          </p>
        )}
        <label className="label" htmlFor="name">Full name</label>
        <input
          id="name" className="input mt-1" required maxLength={100} autoComplete="name"
          value={name} onChange={(e) => setName(e.target.value)} placeholder="Asha Sharma"
        />
        <label className="label mt-3.5 block" htmlFor="email">Email</label>
        <input
          id="email" className="input mt-1" type="email" required autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu"
        />
        <label className="label mt-3.5 block" htmlFor="password">Password</label>
        <input
          id="password" className="input mt-1" type="password" required minLength={8} autoComplete="new-password"
          aria-describedby="password-help"
          value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"
        />
        <p id="password-help" className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          Minimum 8 characters. Stored as a salted hash — never plaintext.
        </p>
        <button type="submit" disabled={busy} className="btn-brand mt-5 w-full justify-center py-2.5 text-sm">
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
