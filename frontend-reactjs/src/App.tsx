// App.tsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Router from "./routes/Router";
import { LoadScript } from "@react-google-maps/api";
import { getGoogleMapsApiKeyApi } from "./api/http";

export default function App() {
  const [apiKey, setApiKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    getGoogleMapsApiKeyApi()
      .then((res: any) => setApiKey(res?.data?.apiKey ?? null))
      .catch((e: any) => {
        console.error("Failed to load Google Maps API key", e);
        setApiKey(null);
      });
  }, []);

  if (!apiKey) return <div className="app">Loading map…</div>;

  return (
    <LoadScript id="google-maps-script" googleMapsApiKey={apiKey}>
      <div className="app">
        <Sidebar />
        <main className="content">
          <Router />
        </main>
      </div>
    </LoadScript>
  );
}