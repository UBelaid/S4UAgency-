import "../css/globals.css";
import type { AppProps } from "next/app";
import { AppProvider } from "../context/LanguageContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
