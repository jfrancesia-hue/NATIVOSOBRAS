"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function NuevaObraPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase no esta configurado.");
      setLoading(false);
      return;
    }

    const profile = await supabase.from("profiles").select("tenant_id").single();
    if (profile.error || !profile.data) {
      setError("No se encontro el perfil del usuario.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("obras").insert({
      tenant_id: profile.data.tenant_id,
      nombre: String(form.get("nombre")),
      organismo_responsable: String(form.get("organismo_responsable")),
      estado: "planificada",
      presupuesto_total: Number(form.get("presupuesto_total")),
      fecha_inicio: String(form.get("fecha_inicio")),
      fecha_fin_estimada: String(form.get("fecha_fin_estimada")),
      lat: Number(form.get("lat")),
      lng: Number(form.get("lng"))
    });

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.replace("/obras");
    router.refresh();
  }

  return (
    <>
      <section className="page-header">
        <div>
          <h1>Nueva obra</h1>
          <p>Alta operativa con presupuesto, organismo, fechas y ubicacion georreferenciada.</p>
        </div>
      </section>
      <form className="panel form-grid" onSubmit={submit}>
        <input name="nombre" placeholder="Nombre de la obra" required />
        <input name="organismo_responsable" placeholder="Organismo responsable" required />
        <input name="presupuesto_total" placeholder="Presupuesto total" type="number" min="0" required />
        <input name="fecha_inicio" type="date" required />
        <input name="fecha_fin_estimada" type="date" required />
        <input name="lat" placeholder="Latitud" type="number" step="any" min="-90" max="90" required />
        <input name="lng" placeholder="Longitud" type="number" step="any" min="-180" max="180" required />
        {error ? <p className="form-error">{error}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          <Save size={18} />
          {loading ? "Guardando" : "Guardar obra"}
        </button>
      </form>
    </>
  );
}
