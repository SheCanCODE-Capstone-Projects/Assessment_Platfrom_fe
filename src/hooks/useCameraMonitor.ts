import { useEffect, useRef, useState } from "react";

export type CameraStatus = "starting" | "active" | "denied" | "unavailable";

export function useCameraMonitor() {
  const [status, setStatus] = useState<CameraStatus>("starting");
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setStatus("active");
      } catch (err) {
        if (cancelled) return;
        const error = err as { name?: string };
        setStatus(
          error.name === "NotAllowedError" ? "denied" : "unavailable"
        );
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  function attachVideo(el: HTMLVideoElement | null) {
    videoRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
    }
  }

  return { status, attachVideo };
}
