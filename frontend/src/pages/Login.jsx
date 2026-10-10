import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login(identifier, password);
      navigate(user?.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(apiError(err, "Login failed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your username or email address."
      footer={<>New here? <Link to="/register" className="font-bold underline underline-offset-2" style={{ color: "var(--ink)" }}>Create an account</Link></>}
    >
      <form onSubmit={submit} noValidate={false}>
        {error && (
          <p role="alert" className="mb-3 rounded-md border-[1.5px] p-2.5 text-[13px] font-semibold" style={{ borderColor: "var(--danger)", background: "var(--chip)", color: "var(--danger)" }}>
            {error}
          </p>
        )}
        <label className="label" htmlFor="identifier">Username or email</label>
        <input
          id="identifier" className="input mt-1" required autoComplete="username"
          value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="asha-01 or you@college.edu"
        />
        <label className="label mt-3.5 block" htmlFor="password">Password</label>
        <input
          id="password" className="input mt-1" type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
        />
        <button type="submit" disabled={busy} className="btn-brand mt-5 w-full justify-center py-2.5 text-sm">
          {busy ? "Signing in…" : "Login"}
        </button>
        <p className="mt-3 text-center text-[13px]">
          <Link to="/forgot" className="font-semibold underline underline-offset-2" style={{ color: "var(--muted)" }}>Forgot password?</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
