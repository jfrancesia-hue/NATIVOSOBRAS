import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { historial } from "@/lib/demo";
import { supabase } from "@/lib/supabase";
import { colors, shadow } from "@/lib/theme";

type HistorialItem = {
  id: string;
  obra: string;
  porcentaje: number;
  fecha: string;
};

type AvanceRow = {
  id: string;
  porcentaje: number | string;
  fecha: string;
  obras?: { nombre?: string } | null;
};

export default function HistorialScreen() {
  const [items, setItems] = useState<HistorialItem[]>(historial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL) return;
      try {
        setLoading(true);
        setError("");
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (!userId) return;

        const { data, error: queryError } = await supabase
          .from("avances_obra")
          .select("id, porcentaje, fecha, obras(nombre)")
          .eq("inspector_id", userId)
          .order("fecha", { ascending: false })
          .limit(50);

        if (queryError) {
          setError(queryError.message);
          return;
        }

        if (data) {
          setItems(
            (data as AvanceRow[]).map((avance) => ({
              id: avance.id,
              obra: avance.obras?.nombre ?? "Obra",
              porcentaje: Number(avance.porcentaje),
              fecha: avance.fecha
            }))
          );
        }
      } catch {
        setError("No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Trazabilidad</Text>
        <Text style={styles.title}>Historial de avances</Text>
      </View>
      {loading ? <ActivityIndicator color={colors.navy} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        ListEmptyComponent={<Text style={styles.empty}>Todavia no hay avances registrados.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.name}>{item.obra}</Text>
              <Text style={styles.badge}>{item.porcentaje}%</Text>
            </View>
            <Text style={styles.meta}>{item.fecha}</Text>
            <Text style={styles.progress}>Avance informado y auditado</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 18, backgroundColor: colors.surface },
  header: { marginBottom: 16 },
  eyebrow: { color: colors.turquoise, fontWeight: "900", textTransform: "uppercase", fontSize: 12, marginBottom: 6 },
  title: { color: colors.navy, fontWeight: "900", fontSize: 30 },
  card: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 12, padding: 16, ...shadow },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  name: { color: colors.ink, fontWeight: "900", fontSize: 17, flex: 1 },
  badge: { color: colors.navy, backgroundColor: "#e8f7f5", overflow: "hidden", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontWeight: "900" },
  meta: { color: colors.muted, marginTop: 8 },
  progress: { color: colors.navy, fontWeight: "800", marginTop: 12 },
  error: { color: colors.danger, marginBottom: 10 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 30 }
});
