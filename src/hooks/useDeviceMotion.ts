import { useCallback, useEffect, useState } from "react";

type Vector3 = {
  x: number | null;
  y: number | null;
  z: number | null;
};

type MotionReading = {
  acceleration: Vector3;
  accelerationIncludingGravity: Vector3;
  rotationRate: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  };
  interval: number | null;
  timestamp: number;
};

type OrientationReading = {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean;
  timestamp: number;
};

type SensorStatus = "idle" | "requesting" | "running" | "unsupported" | "error";

type DeviceMotionEventWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const emptyVector = (): Vector3 => ({
  x: null,
  y: null,
  z: null
});

export function useDeviceMotion() {
  const [status, setStatus] = useState<SensorStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [motion, setMotion] = useState<MotionReading | null>(null);
  const [orientation, setOrientation] = useState<OrientationReading | null>(null);

  const start = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !("DeviceMotionEvent" in window) ||
      !("DeviceOrientationEvent" in window)
    ) {
      setStatus("unsupported");
      setError("Motion or orientation sensors are not supported.");
      return;
    }

    setStatus("requesting");
    setError(null);

    try {
      // Some browsers, notably iOS Safari, require explicit permission.
      const motionEventClass = window.DeviceMotionEvent as DeviceMotionEventWithPermission;

      const orientationEventClass =
        window.DeviceOrientationEvent as DeviceOrientationEventWithPermission;

      if (motionEventClass.requestPermission) {
        const permission = await motionEventClass.requestPermission();

        if (permission !== "granted") {
          throw new Error("Motion sensor permission was not granted.");
        }
      }

      if (orientationEventClass.requestPermission) {
        const permission = await orientationEventClass.requestPermission();

        if (permission !== "granted") {
          throw new Error("Orientation sensor permission was not granted.");
        }
      }

      // Avoid registering the same handlers more than once.
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);

      window.addEventListener("devicemotion", handleMotion);
      window.addEventListener("deviceorientation", handleOrientation);

      setStatus("running");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to start sensors.");
    }
  }, []);

  const handleMotion = (event: DeviceMotionEvent) => {
    setMotion({
      acceleration: {
        x: event.acceleration?.x ?? null,
        y: event.acceleration?.y ?? null,
        z: event.acceleration?.z ?? null
      },
      accelerationIncludingGravity: {
        x: event.accelerationIncludingGravity?.x ?? null,
        y: event.accelerationIncludingGravity?.y ?? null,
        z: event.accelerationIncludingGravity?.z ?? null
      },
      rotationRate: {
        alpha: event.rotationRate?.alpha ?? null,
        beta: event.rotationRate?.beta ?? null,
        gamma: event.rotationRate?.gamma ?? null
      },
      interval: event.interval ?? null,
      timestamp: performance.now()
    });
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
      absolute: event.absolute,
      timestamp: performance.now()
    });
  };

  const stop = useCallback(() => {
    window.removeEventListener("devicemotion", handleMotion);
    window.removeEventListener("deviceorientation", handleOrientation);

    setStatus("idle");
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("devicemotion", handleMotion);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return {
    status,
    error,
    motion,
    orientation,
    start,
    stop
  };
}
