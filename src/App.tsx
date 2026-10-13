import MapLibre from "./components/MapLibre";
import SensorMonitor from "./components/SensorMonitor/SensorMonitor";

import "./App.css";

function App() {
  return (
    <div className="appWrapper">
      <MapLibre />
      <SensorMonitor />
    </div>
  );
}

export default App;
