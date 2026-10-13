import { useEffect, useRef } from "react";
import { GeolocateControl, Map, MapLibreMap } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";
import "./MapLibre.css";

const MapLibre = () => {
  const mapRef = useRef<MapLibreMap>(null);
  useEffect(() => {
    const map = new Map({
      container: "map-libre-container", // container id
      style: "https://tiles.openfreemap.org/styles/liberty", // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1, // starting zoom
      maplibreLogo: true
    });

    // Create and add the geolocate control
    const geolocate = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true // Uses GPS instead of IP/Wi-Fi positioning if available
      },
      trackUserLocation: true, // Continuously updates map as user moves
      showUserLocation: true // Shows a blue dot at the user's location
    });

    map.addControl(geolocate);

    mapRef.current = map;
  }, []);

  return <div id="map-libre-container" />;
};

export default MapLibre;
