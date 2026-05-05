import { router } from "expo-router";
import { useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { colors, images, shadow } from "@/lib/theme";

function HelmetIcon() {
  return (
    <View style={styles.toolIcon}>
      <View style={styles.helmetDome} />
      <View style={styles.helmetBrim} />
    </View>
  );
}

function ConeIcon() {
  return (
    <View style={styles.coneTool}>
      <View style={styles.coneBody} />
      <View style={styles.coneBase} />
    </View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");
    if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
      router.replace("/obras");
      return;
    }
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.replace("/obras");
  }

  return (
    <ImageBackground source={{ uri: images.roadwork }} style={styles.screen} imageStyle={styles.bgImage}>
      <View style={styles.overlay} />
      <View style={styles.hero}>
        <View style={styles.brandRow}>
          <View style={styles.mark}><Text style={styles.markText}>N</Text></View>
          <View>
            <Text style={styles.brand}>Nativos Obras360</Text>
            <Text style={styles.brandMeta}>Operacion territorial</Text>
          </View>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>App inspector</Text>
          <Text style={styles.title}>Evidencia de obra en campo</Text>
          <Text style={styles.subtitle}>Foto, GPS, avance y auditoria desde una pantalla preparada para territorio.</Text>
        </View>
        <View style={styles.toolRow}>
          <View style={styles.toolPill}><HelmetIcon /><Text style={styles.toolText}>Seguridad</Text></View>
          <View style={styles.toolPill}><ConeIcon /><Text style={styles.toolText}>Alertas</Text></View>
        </View>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Acceso institucional</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email institucional" placeholderTextColor="#94a3b8" autoCapitalize="none" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#94a3b8" secureTextEntry style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "space-between", padding: 22, backgroundColor: colors.navy },
  bgImage: { opacity: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(17,24,39,0.72)" },
  hero: { marginTop: 34, gap: 24 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  mark: { width: 54, height: 54, borderRadius: 10, backgroundColor: colors.yellow, alignItems: "center", justifyContent: "center" },
  markText: { color: colors.navy, fontWeight: "900", fontSize: 24 },
  brand: { color: colors.white, fontWeight: "900", fontSize: 16 },
  brandMeta: { color: "#cbd5e1", fontWeight: "700", marginTop: 2 },
  titleBlock: { gap: 10 },
  eyebrow: { color: colors.yellow, fontWeight: "900", textTransform: "uppercase", fontSize: 12 },
  title: { color: colors.white, fontWeight: "900", fontSize: 42, lineHeight: 43 },
  subtitle: { color: "#dbe4ef", fontSize: 16, lineHeight: 23 },
  toolRow: { flexDirection: "row", gap: 10 },
  toolPill: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.18)", borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9 },
  toolText: { color: colors.white, fontWeight: "900", fontSize: 12 },
  toolIcon: { width: 24, height: 22 },
  helmetDome: { position: "absolute", left: 3, top: 5, width: 18, height: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, backgroundColor: colors.yellow },
  helmetBrim: { position: "absolute", left: 1, top: 16, width: 22, height: 4, borderRadius: 8, backgroundColor: colors.yellow },
  coneTool: { width: 24, height: 22 },
  coneBody: { position: "absolute", left: 6, top: 2, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderBottomWidth: 17, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: colors.orange },
  coneBase: { position: "absolute", left: 2, bottom: 1, width: 20, height: 4, borderRadius: 8, backgroundColor: colors.yellow },
  panel: { backgroundColor: "rgba(255,255,255,0.96)", borderColor: "rgba(255,255,255,0.34)", borderWidth: 1, borderRadius: 12, padding: 18, marginBottom: 16, ...shadow },
  panelTitle: { color: colors.navy, fontWeight: "900", fontSize: 19, marginBottom: 12 },
  input: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 12, color: colors.ink },
  button: { backgroundColor: colors.orange, borderRadius: 8, minHeight: 52, alignItems: "center", justifyContent: "center", marginTop: 8 },
  buttonText: { color: colors.navy, fontWeight: "900" },
  error: { color: colors.danger, marginBottom: 8 }
});
