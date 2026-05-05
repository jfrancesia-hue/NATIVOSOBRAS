import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0b2d4d" },
        headerTintColor: "#ffffff",
        headerTitleStyle: { fontWeight: "700" }
      }}
    />
  );
}
