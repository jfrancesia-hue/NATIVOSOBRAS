import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { colors, images, shadow } from "@/lib/theme";

export default function CargarAvanceScreen() {
  const params = useLocalSearchParams<{ id: string; nombre: string }>();
  const [porcentaje, setPorcentaje] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState<string | null>(null);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [saving, setSaving] = useState(false);

  async function tomarFoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert("Camara requerida", "La foto es obligatoria para cargar avances.");
    const result = await ImagePicker.launchCameraAsync({ quality: 0.75 });
    if (!result.canceled) setFoto(result.assets[0].uri);
  }

  async function obtenerGps() {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (!permission.granted) return Alert.alert("GPS requerido", "No se puede cargar un avance sin ubicacion.");
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setCoords(location.coords);
  }

  async function guardar() {
    if (saving) return;
    if (!foto || !coords) return Alert.alert("Faltan validaciones", "La carga requiere foto y GPS obligatorio.");
    const numero = Number(porcentaje);
    if (!Number.isFinite(numero) || numero < 0 || numero > 100) return Alert.alert("Avance invalido", "Ingresa un porcentaje entre 0 y 100.");
    if (descripcion.trim().length < 3) return Alert.alert("Comentario requerido", "Agrega una descripcion breve.");

    if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_API_URL) {
      Alert.alert("Avance registrado", "Modo demo: foto y GPS fueron validados.", [{ text: "Aceptar", onPress: () => router.replace("/historial") }]);
      return;
    }

    try {
      setSaving(true);
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;
      if (!session) return Alert.alert("Sesion requerida", "Vuelve a iniciar sesion para sincronizar el avance.");

      const imageResponse = await fetch(foto);
      const blob = await imageResponse.blob();
      const path = `${params.id}/${session.user.id}/${Date.now()}.jpg`;
      const upload = await supabase.storage.from("avances-obra").upload(path, blob, { contentType: "image/jpeg" });
      if (upload.error) return Alert.alert("Error al subir foto", upload.error.message);

      const apiResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/avances`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          obra_id: params.id,
          inspector_id: session.user.id,
          porcentaje: numero,
          descripcion,
          foto_url: path,
          lat: coords.latitude,
          lng: coords.longitude
        })
      });

      if (!apiResponse.ok) {
        const body = await apiResponse.json().catch(() => ({ error: "No se pudo sincronizar" }));
        return Alert.alert("Error al guardar", body.error ?? "No se pudo sincronizar");
      }

      Alert.alert("Avance registrado", "La carga fue sincronizada con Supabase.", [{ text: "Aceptar", onPress: () => router.replace("/historial") }]);
    } catch {
      Alert.alert("Error de conexion", "No se pudo completar la carga. Intentalo nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ImageBackground source={{ uri: foto ?? images.roadwork }} style={styles.header} imageStyle={styles.headerImage}>
        <View style={styles.headerOverlay} />
        <Text style={styles.eyebrow}>Carga de evidencia</Text>
        <Text style={styles.title}>{params.nombre}</Text>
        <View style={styles.requirements}>
          <View style={[styles.reqItem, foto && styles.reqOk]}><Text style={styles.reqText}>Foto</Text></View>
          <View style={[styles.reqItem, coords && styles.reqGps]}><Text style={styles.reqText}>GPS</Text></View>
          <View style={styles.reqItem}><Text style={styles.reqText}>Avance</Text></View>
        </View>
      </ImageBackground>

      <View style={styles.panel}>
        <Text style={styles.label}>Porcentaje informado</Text>
        <TextInput value={porcentaje} onChangeText={setPorcentaje} placeholder="0 a 100" keyboardType="numeric" style={styles.input} />
        <Text style={styles.label}>Comentario tecnico</Text>
        <TextInput value={descripcion} onChangeText={setDescripcion} placeholder="Describe el avance observado" multiline style={[styles.input, styles.textarea]} />
        <View style={styles.row}>
          <Pressable style={[styles.button, foto && styles.buttonOk]} onPress={tomarFoto}>
            <Text style={styles.buttonText}>{foto ? "Foto lista" : "Tomar foto"}</Text>
          </Pressable>
          <Pressable style={[styles.button, coords && styles.buttonOk]} onPress={obtenerGps}>
            <Text style={styles.buttonText}>{coords ? "GPS listo" : "Validar GPS"}</Text>
          </Pressable>
        </View>
      </View>

      {foto ? <Image source={{ uri: foto }} style={styles.preview} /> : null}
      {coords ? <Text style={styles.ok}>GPS validado: {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}</Text> : null}
      <View style={styles.validationRow}>
        <View style={[styles.validationPill, foto && styles.validationOk]}><Text style={styles.validationText}>Evidencia fotografica</Text></View>
        <View style={[styles.validationPill, coords && styles.validationGps]}><Text style={styles.validationText}>Geocerca GPS</Text></View>
      </View>
      <Pressable style={[styles.save, saving && styles.disabled]} onPress={guardar}>
        {saving ? <ActivityIndicator color="#0b2d4d" /> : <Text style={styles.saveText}>Guardar avance</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 18, backgroundColor: colors.surface },
  header: { minHeight: 210, overflow: "hidden", borderRadius: 12, padding: 18, justifyContent: "flex-end", marginBottom: 14, backgroundColor: colors.navy },
  headerImage: { borderRadius: 12 },
  headerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(17,24,39,0.64)" },
  eyebrow: { color: colors.yellow, fontWeight: "900", textTransform: "uppercase", fontSize: 12, marginBottom: 6 },
  title: { color: colors.white, fontWeight: "900", fontSize: 30, lineHeight: 33 },
  requirements: { flexDirection: "row", gap: 8, marginTop: 14 },
  reqItem: { borderRadius: 999, backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.2)", borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  reqOk: { backgroundColor: colors.orange },
  reqGps: { backgroundColor: colors.blue },
  reqText: { color: colors.white, fontWeight: "900", fontSize: 12 },
  panel: { backgroundColor: colors.white, borderColor: "rgba(17,24,39,0.14)", borderWidth: 1, borderLeftColor: colors.orange, borderLeftWidth: 6, borderRadius: 12, padding: 16, ...shadow },
  label: { color: colors.navy, fontWeight: "900", marginBottom: 7 },
  input: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 14 },
  textarea: { minHeight: 92, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 10 },
  button: { flex: 1, backgroundColor: colors.navy, borderRadius: 8, minHeight: 46, alignItems: "center", justifyContent: "center" },
  buttonOk: { backgroundColor: colors.ok },
  buttonText: { color: colors.white, fontWeight: "900" },
  preview: { width: "100%", height: 210, borderRadius: 8, marginTop: 12 },
  ok: { color: colors.ok, fontWeight: "800", marginTop: 12 },
  validationRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  validationPill: { flex: 1, minHeight: 40, borderRadius: 8, backgroundColor: "#e8eef4", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  validationOk: { backgroundColor: colors.orange },
  validationGps: { backgroundColor: colors.blue },
  validationText: { color: colors.white, fontWeight: "900", fontSize: 12, textAlign: "center" },
  save: { backgroundColor: colors.orange, borderRadius: 8, minHeight: 52, alignItems: "center", justifyContent: "center", marginTop: 16 },
  saveText: { color: colors.navy, fontWeight: "900" },
  disabled: { opacity: 0.65 }
});
