"use client";

import { Download } from "lucide-react";

export function PrintButton() {
  return (
    <button className="button" type="button" onClick={() => window.print()}>
      <Download size={18} />
      Imprimir PDF
    </button>
  );
}
