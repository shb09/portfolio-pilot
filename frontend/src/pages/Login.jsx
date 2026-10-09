import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err, "Login failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue building your career story."
      footer={<>New here? <Link to="/register" className="font-bold underline underline-offset-2" style={{ color: "var(--brand)" }}>Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate={false}>
        {error && (
          <p role="alert" className="mb-3 rounded-md p-2.5 text-[13px] font-medium" style={{ background: "var(--chip)", color: "var(--danger)" }}>
            {error}
          </p>
        )}
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email" className="input mt-1" type="email" required autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu"
        />
        <label className="label mt-3.5 block" htmlFor="password">Password</label>
        <input
          id="password" className="input mt-1" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
        />
        <button type="submit" disabled={busy} className="btn-brand mt-5 w-full justify-center py-2.5 text-sm">
          {busy ? "Logging in…" : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}
