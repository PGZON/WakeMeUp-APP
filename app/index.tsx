import { Redirect } from "expo-router";

export default function Index() {
  // Directly redirect to main app without authentication check
  return <Redirect href="/(app)" />;
}