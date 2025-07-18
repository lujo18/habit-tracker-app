import { Slot } from "expo-router";

import "../global.css";

import { LoadingProvider } from "../components/LoadingProvider";
import { AuthProvider } from "../contexts/AuthContext";

const RootLayout = () => {
  console.log("\n\nNEW RUN " + "\n\n");

  return (
    <AuthProvider>
      <LoadingProvider>
        <Slot />
      </LoadingProvider>
    </AuthProvider>
  );
};

export default RootLayout;
