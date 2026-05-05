"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export function AvanceForm({ obraId }: { obraId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase no esta configurado.");
      setLoading(false);
      return;
    }

    const form = new FormData(event.currentTarget);
    const porcentaje = Number(form.get("porcentaje"));
    const lat = Number(form.get("lat"));
    const lng = Number(form.get("lng"));
    const fotoUrl = String(form.get("foto_url") ?? "").trim();
    const descripcion = String(form.get("descripcion") ?? "").trim();

    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      setError("El porcentaje debe estar entre 0 y 100.");
      setLoading(false);
      return;
    }

    if (!descripcion || !fotoUrl) {
      setError("Descripcion y URL de foto son obligatorias.");
      setLoading(false);
      return;
    }

    const user = await supabase.auth.getUser();
    if (user.error || !user.data.user) {
      setError("Tenes que iniciar sesion para cargar avances.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("avances_obra").insert({
      obra_id: obraId,
      inspector_id: user.data.user.id,
      porcentaje,
      descripcion,
      foto_url: fotoUrl,
      lat,
      lng
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.replace(`/obras/${obraId}`);
    router.refresh();
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <input name="porcentaje" placeholder="Porcentaje de avance" type="number" min="0" max="100" step="0.01" required />
      <input name="foto_url" placeholder="URL privada o firmada de la foto" type="url" required />
      <input name="lat" placeholder="Latitud" type="number" step="any" min="-90" max="90" required />
      <input name="lng" placeholder="Longitud" type="number" step="any" min="-180" max="180" required />
      <textarea name="descripcion" placeholder="Descripcion tecnica del avance observado" rows={5} required />
      {error ? <p className="form-error">{error}</p> : null}
      <button className="button" type="submit" disabled={loading}>
        {loading ? <Camera size={18} /> : <Save size={18} />}
        {loading ? "Registrando" : "Registrar avance"}
      </button>
    </form>
  );
}
