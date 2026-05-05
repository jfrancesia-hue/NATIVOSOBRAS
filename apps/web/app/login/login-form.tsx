"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      setLoading(false);
      return;
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    router.replace(params.get("next") ?? "/dashboard");
    router.refresh();
  }

  return (
    <form className="login-panel" onSubmit={submit}>
      <div>
        <span className="eyebrow">Ingreso seguro</span>
        <h1>Entrar al sistema</h1>
        <p>Usa tus credenciales institucionales para acceder al tablero operativo.</p>
      </div>
      <label className="input-wrap">
        <Mail size={18} />
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" autoComplete="email" />
      </label>
      <label className="input-wrap">
        <LockKeyhole size={18} />
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" autoComplete="current-password" />
      </label>
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button" type="submit" disabled={loading}>
        <LogIn size={18} />
        {loading ? "Ingresando" : "Ingresar"}
      </button>
      <small>El acceso requiere Supabase configurado y perfiles creados por tenant.</small>
    </form>
  );
}
