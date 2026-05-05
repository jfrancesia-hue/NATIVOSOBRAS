import { ArrowLeft } from "lucide-react";
import { AvanceForm } from "./avance-form";

export default async function NuevoAvancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <section className="page-header">
        <div>
          <a className="text-link" href={`/obras/${id}`}>
            <ArrowLeft size={16} />
            Volver al detalle
          </a>
          <h1>Cargar avance</h1>
          <p>Registro operativo con porcentaje, evidencia fotografica y coordenadas de campo.</p>
        </div>
      </section>
      <AvanceForm obraId={id} />
    </>
  );
}
