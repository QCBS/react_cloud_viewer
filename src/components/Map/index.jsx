import { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import _, { every, set } from "lodash";
import { amfhot, haline, ocean, custom } from "./colormaps";
import BaseLegend from "./BaseLegend";
import { MapLibreStyleSwitcherControl } from "./styleswitcher";
import { baseLayers } from "./mapStyle";
import { useSearchParams } from "react-router-dom";
import "./map.css";

export default function Map(props) {
  const { opacity } = props;

  const [mapp, setMapp] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const layers_json_uri = searchParams.get("layers_json_uri");
  const [valueColors, setValueColors] = useState([]);
  const mapRef = useRef();
  //const colormap = encodeURIComponent(JSON.stringify(amfhot));
  const colormap = "viridis";

  useEffect(() => {
    let ignore = true;
    let protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);
    return () => {
      maplibregl.removeProtocol("pmtiles");
      ignore = false;
    };
  }, []);

  useEffect(() => {
    if (!mapp) {
      const map = new maplibregl.Map({
        container: "App",
        zoom: 3.5,
        center: [-75, 58],
        style: {
          version: 8,
          projection: {
            type: "globe",
          },
          sources: {
            terrain: {
              type: "raster-dem",
              tiles: [
                "https://tiler.biodiversite-quebec.ca/cog/tiles/{z}/{x}/{y}?url=https://object-arbutus.cloud.computecanada.ca/bq-io/io/earthenv/topography/elevation_1KMmn_GMTEDmn.tif&rescale=0,2013&bidx=1&expression=b1",
              ],
              tileSize: 256,
            },
            background: {
              type: "raster",
              tiles: [
                "https://01.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "back",
              type: "raster",
              source: "background",
            },
          ],
        },
      });
      map.once("load", () => {
        fetch(layers_json_uri)
          .then((res) => res.json())
          .then((sty) => {
            Object.entries(sty.sources).forEach(([sourceId, sourceDef]) => {
              if (map && !map.getSource(sourceId)) {
                map.addSource(sourceId, sourceDef);
              }
            });
            sty.layers.forEach((layerDef, layerId) => {
              if (map && !map.getLayer(layerId)) {
                let lyr = map.addLayer(layerDef);
              }
            });
            map.fitBounds(sty.bounds);
            if (sty.legend) {
              setValueColors(sty.legend);
            }
          });
      });

      map.addControl(new maplibregl.GlobeControl());
      map.addControl(
        new maplibregl.NavigationControl({
          showZoom: true,
          showCompass: false,
        }),
      );
      map.on("click", (e) => {
        const features = map.queryRenderedFeatures(e.point);
        const container = document.createElement("div");

        ReactDOM.createRoot(container).render(
          <div style={{ textAlign: "left", fontSize: "14px" }}>
            <>
              <div
                style={{
                  fontSize: "10px",
                  paddingTop: "5px",
                  color: "#3f5830",
                }}
              >
                <table>
                  {Object.entries(features[0].properties).map(
                    ([key, value]) => {
                      return (
                        <tr key={key}>
                          <td
                            style={{ fontWeight: "bold", paddingRight: "5px" }}
                          >
                            {key}:
                          </td>
                          <td>{value}</td>
                        </tr>
                      );
                    },
                  )}
                </table>
              </div>
            </>
          </div>,
        );

        new maplibregl.Popup()
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .setDOMContent(container)
          .addTo(map);
      });

      map.addControl(new MapLibreStyleSwitcherControl());
      setMapp(map);
      return () => {
        map.remove();
      };
    }
  }, []);

  // determine legend params based on colorBy
  return (
    <div
      id="App"
      className="App"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: "0",
        background: "url('/night-sky.png')",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 20,
          zIndex: 2000,
          pointerEvents: "auto",
          backgroundColor: "white",
          padding: "10px",
          width: 120,
          borderRadius: 5,
        }}
      >
        {BaseLegend(valueColors)}
      </div>
    </div>
  );
}
