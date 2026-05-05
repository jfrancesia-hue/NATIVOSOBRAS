import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ImageBackground, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { obrasAsignadas } from "@/lib/demo";
import { supabase } from "@/lib/supabase";
import { colors, images, shadow } from "@/lib/theme";

type ObraAsignada = {
  id: string;
  nombre: string;
  organismo_responsable: string;
  direccion?: string;
  avance_fisico: number;
};

export default function ObrasScreen() {
  const [obras, setObras] = useState<ObraAsignada[]>(obrasAsignadas);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!process.env.EXPO_PUBLIC_SUPABASE_URL) return;
    try {
      setLoading(true);
      setError("");
      const { data, error: queryError } = await supabase
        .from("obras_resumen")
        .select("id, nombre, organismo_responsable, avance_fisico")
        .order("updated_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        return;
      }

      setObras(
        (data ?? []).map((obra) => ({
          ...obra,
          avance_fisico: Number(obra.avance_fisico)
        }))
      );
    } catch {
      setError("No se pudieron cargar las obras asignadas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.screen}>
      <ImageBackground source={{ uri: images.paving }} style={styles.header} imageStyle={styles.headerImage}>
        <View style={styles.headerOverlay} />
        <Text style={styles.eyebrow}>Operacion territorial</Text>
        <Text style={styles.title}>Obras asignadas</Text>
        <Text style={styles.subtitle}>Selecciona una obra para cargar evidencia con foto y GPS.</Text>
        <View style={styles.headerStats}>
          <View><Text style={styles.statValue}>{obras.length}</Text><Text style={styles.statLabel}>obras</Text></View>
          <View><Text style={styles.statValue}>GPS</Text><Text style={styles.statLabel}>requerido</Text></View>
        </View>
      </ImageBackground>
      {loading ? <ActivityIndicator color={colors.navy} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={obras}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay obras asignadas para este inspector.</Text>}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push({ pathname: "/cargar-avance", params: { id: item.id, nombre: item.nombre } })}>
            <View style={styles.cardTop}>
              <View style={styles.cardIcon}><View style={styles.craneArm} /><View style={styles.craneBase} /></View>
              <View>
                <Text style={styles.name}>{item.nombre}</Text>
                <Text style={styles.meta}>{item.organismo_responsable}</Text>
              </View>
              <Text style={styles.badge}>{item.avance_fisico}%</Text>
            </View>
            {item.direccion ? <Text style={styles.meta}>{item.direccion}</Text> : null}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, Math.max(0, item.avance_fisico))}%` }]} />
            </View>
            <Text style={styles.action}>Cargar nuevo avance</Text>
          </Pressable>
        )}
      />
      <Pressable style={styles.secondary} onPress={() => router.push("/historial")}>
        <Text style={styles.secondaryText}>Ver historial</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 18, backgroundColor: colors.surface },
  header: { minHeight: 230, overflow: "hidden", borderRadius: 12, padding: 18, justifyContent: "flex-end", marginBottom: 16, backgroundColor: colors.navy },
  headerImage: { borderRadius: 12 },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(17,24,39,0.68)" },
  eyebrow: { color: colors.yellow, fontWeight: "900", textTransform: "uppercase", fontSize: 12, marginBottom: 6 },
  title: { color: colors.white, fontWeight: "900", fontSize: 34, lineHeight: 36 },
  subtitle: { color: "#dbe4ef", marginTop: 6, lineHeight: 21 },
  headerStats: { flexDirection: "row", gap: 10, marginTop: 16 },
  statValue: { color: colors.yellow, fontWeight: "900", fontSize: 20 },
  statLabel: { color: "#cbd5e1", fontWeight: "800", fontSize: 12, textTransform: "uppercase" },
  card: { backgroundColor: colors.white, borderColor: "rgba(17,24,39,0.12)", borderWidth: 1, borderLeftColor: colors.orange, borderLeftWidth: 6, borderRadius: 12, padding: 16, ...shadow },
  cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  cardIcon: { width: 34, height: 34, borderRadius: 8, backgroundColor: colors.navy, marginRight: 2 },
  craneArm: { position: "absolute", left: 8, top: 8, width: 22, height: 4, backgroundColor: colors.yellow },
  craneBase: { position: "absolute", left: 8, top: 8, width: 4, height: 22, backgroundColor: colors.yellow },
  name: { color: colors.ink, fontWeight: "900", fontSize: 17 },
  meta: { color: colors.muted, marginTop: 4 },
  badge: { color: colors.navy, backgroundColor: colors.yellow, overflow: "hidden", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, fontWeight: "900" },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: "#e7eef4", marginTop: 16, overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 999, backgroundColor: colors.orange },
  action: { color: colors.navy, fontWeight: "900", marginTop: 14 },
  secondary: { marginTop: 14, minHeight: 44, alignItems: "center", justifyContent: "center" },
  secondaryText: { color: colors.navy, fontWeight: "900" },
  error: { color: colors.danger, marginBottom: 10 },
  empty: { color: colors.muted, textAlign: "center", marginTop: 30 }
});
