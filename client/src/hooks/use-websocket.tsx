import { useEffect, useRef } from "react";
import { useAuth } from "./use-auth";
import { queryClient } from "@/lib/queryClient";

export function useWebSocket() {
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "AUTH", userId: user.id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "TASK_CREATED":
        case "TASK_UPDATED":
          queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
          break;
      }
    };

    return () => {
      ws.close();
    };
  }, [user]);

  return wsRef.current;
}
