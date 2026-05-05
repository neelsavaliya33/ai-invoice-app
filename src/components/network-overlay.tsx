"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button, Card } from "@/components/ui";

const CONNECTIVITY_URL = "https://google.com";
const CHECK_INTERVAL_MS = 12000;
const CHECK_TIMEOUT_MS = 3500;

async function canReachInternet() {
  if (!navigator.onLine) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    await fetch(`${CONNECTIVITY_URL}?${Date.now()}`, {
      cache: "no-store",
      mode: "no-cors",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function NetworkOverlay() {
  const [offline, setOffline] = useState(false);
  const [checking, setChecking] = useState(false);
  const checkInFlight = useRef(false);

  const syncNetworkState = useCallback(async () => {
    if (checkInFlight.current) return;
    checkInFlight.current = true;
    setChecking(true);

    const online = await canReachInternet();
    setOffline(!online);
    setChecking(false);
    checkInFlight.current = false;
  }, []);

  useEffect(() => {
    void syncNetworkState();

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void syncNetworkState();
    };

    const interval = window.setInterval(() => {
      void syncNetworkState();
    }, CHECK_INTERVAL_MS);

    window.addEventListener("online", syncNetworkState);
    window.addEventListener("offline", syncNetworkState);
    window.addEventListener("focus", syncNetworkState);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("online", syncNetworkState);
      window.removeEventListener("offline", syncNetworkState);
      window.removeEventListener("focus", syncNetworkState);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [syncNetworkState]);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-background/80 p-4 backdrop-blur-md">
      <Card className="w-full max-w-md animate-scale-in p-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-destructive/10 text-destructive">
          <WifiOff className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-2xl font-bold">No internet connection</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          KoshPilot is waiting for your network to reconnect. Your current screen
          will stay open, and the overlay will close automatically once you are
          back online.
        </p>
        <Button
          className="mt-6 w-full"
          disabled={checking}
          onClick={() => void syncNetworkState()}
        >
          <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
          {checking ? "Checking..." : "Check connection"}
        </Button>
      </Card>
    </div>
  );
}
