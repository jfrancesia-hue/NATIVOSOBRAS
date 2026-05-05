export const constructionImages = {
  heroObraPublica:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1800&q=82",
  inspectorCampo:
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=82",
  maquinariaVial:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=82",
  rutaConstruccion:
    "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1400&q=82",
  viviendaSocial:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=82",
  puenteInfraestructura:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=82",
  planosObra:
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=82",
  hormigon:
    "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?auto=format&fit=crop&w=1400&q=82",
  cascoSeguridad:
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=82"
} as const;

export const obraImagePool = [
  constructionImages.heroObraPublica,
  constructionImages.rutaConstruccion,
  constructionImages.viviendaSocial,
  constructionImages.puenteInfraestructura,
  constructionImages.maquinariaVial,
  constructionImages.hormigon
];

export function imageForIndex(index: number) {
  return obraImagePool[index % obraImagePool.length];
}
