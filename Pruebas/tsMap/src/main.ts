import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import { MapService } from "./map-service";
import { MyGeolocation } from "./my-geolocation";
import { Point } from "ol/geom";

async function showMap() {
  const coords = await MyGeolocation.getLocation();
  const mapService = new MapService(coords, "map");
  const marker = mapService.createMarker(coords);

  const autocomplete = new GeocoderAutocomplete(
    document.getElementById("autocomplete")!,
    "42c7710f83bc41698b841fec7a3b5d2d",
    { lang: "es", debounceDelay: 600 }
  );
  
  autocomplete.on("select", (location) => {
    console.log(location.geometry.coordinates);
    marker.setGeometry(new Point(location.geometry.coordinates));
    mapService.view.setCenter(location.geometry.coordinates);
  });
}

showMap();