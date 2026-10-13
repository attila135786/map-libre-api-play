import { useDeviceMotion } from "../../hooks/useDeviceMotion";

function SensorMonitor() {
  const { status, error, motion, orientation, start, stop } = useDeviceMotion();

  const format = (value: number | null | undefined) => (value == null ? "—" : value.toFixed(3));

  return (
    <div
      style={{
        padding: 20,
        width: "25%",
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: "rgba(0, 0, 0, .4)",
        color: "black"
      }}
    >
      <h2>Device Sensors</h2>

      <p>Status: {status}</p>

      <button
        style={{ cursor: "pointer" }}
        onClick={start}
        disabled={status === "running"}
      >
        Start sensors
      </button>

      <button
        style={{ cursor: "pointer" }}
        onClick={stop}
        disabled={status !== "running"}
      >
        Stop sensors
      </button>

      {error && <p role="alert">{error}</p>}

      <h3>Acceleration (m/s²)</h3>
      <p>
        X: {format(motion?.acceleration.x)} Y: {format(motion?.acceleration.y)} Z:{" "}
        {format(motion?.acceleration.z)}
      </p>

      <h3>Acceleration including gravity (m/s²)</h3>
      <p>
        X: {format(motion?.accelerationIncludingGravity.x)} Y:{" "}
        {format(motion?.accelerationIncludingGravity.y)} Z:{" "}
        {format(motion?.accelerationIncludingGravity.z)}
      </p>

      <h3>Rotation rate (degrees/second)</h3>
      <p>
        Alpha: {format(motion?.rotationRate.alpha)} Beta: {format(motion?.rotationRate.beta)} Gamma:{" "}
        {format(motion?.rotationRate.gamma)}
      </p>

      <h3>Device orientation (degrees)</h3>
      <p>
        Alpha: {format(orientation?.alpha)} Beta: {format(orientation?.beta)} Gamma:{" "}
        {format(orientation?.gamma)}
      </p>

      <p>Absolute orientation: {orientation ? String(orientation.absolute) : "—"}</p>
    </div>
  );
}

export default SensorMonitor;
