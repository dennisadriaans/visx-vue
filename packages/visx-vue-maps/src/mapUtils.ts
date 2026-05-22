import inside from "@turf/boolean-point-in-polygon";
import proj4 from "proj4";
import type { DottedMapGrid, DottedMapPoint, MapData, MapRegion } from "./types";

if (!proj4.defs("GOOGLE")) {
  proj4.defs(
    "GOOGLE",
    "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs",
  );
}

type GeoJsonGeometry = {
  type: string;
  coordinates: unknown;
};

type GeoJsonFeature = {
  id?: string;
  geometry: GeoJsonGeometry;
};

type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

const project = (
  from: string | undefined,
  toOrCoords: string | [number, number],
  coords?: [number, number],
) => {
  if (Array.isArray(toOrCoords)) {
    return proj4("GOOGLE", toOrCoords) as [number, number];
  }

  return proj4(from ?? "GOOGLE", toOrCoords, coords as [number, number]) as [number, number];
};

export const DEFAULT_WORLD_REGION: MapRegion = {
  lat: { min: -56, max: 71 },
  lng: { min: -179, max: 179 },
};

export const geojsonToMultiPolygons = (geojson: GeoJsonFeatureCollection) => {
  const coordinates = geojson.features.reduce<unknown[]>((poly, feature) => {
    if (feature.geometry.type === "Polygon") {
      return poly.concat([feature.geometry.coordinates]);
    }

    return poly.concat(feature.geometry.coordinates as unknown[]);
  }, []);

  return { type: "Feature", geometry: { type: "MultiPolygon", coordinates } };
};

export const computeGeojsonBox = (geojson: any): MapRegion => {
  const { type, features, geometry, coordinates } = geojson;

  if (type === "FeatureCollection") {
    const boxes = features.map(computeGeojsonBox);
    return {
      lat: {
        min: Math.min(...boxes.map((box: MapRegion) => box.lat.min)),
        max: Math.max(...boxes.map((box: MapRegion) => box.lat.max)),
      },
      lng: {
        min: Math.min(...boxes.map((box: MapRegion) => box.lng.min)),
        max: Math.max(...boxes.map((box: MapRegion) => box.lng.max)),
      },
    };
  }

  if (type === "Feature") return computeGeojsonBox(geometry);

  if (type === "MultiPolygon") {
    return computeGeojsonBox({
      type: "Polygon",
      coordinates: (coordinates as unknown[][][]).flat(1),
    });
  }

  if (type === "Polygon") {
    const coords = (coordinates as [number, number][][]).flat(1);
    const latitudes = coords.map(([, lat]) => lat);
    const longitudes = coords.map(([lng]) => lng);

    return {
      lat: {
        min: Math.min(...latitudes),
        max: Math.max(...latitudes),
      },
      lng: {
        min: Math.min(...longitudes),
        max: Math.max(...longitudes),
      },
    };
  }

  throw new Error(`Unknown geojson type ${type}`);
};

export const getMap = ({
  height = 0,
  width = 0,
  countries = [],
  region,
  grid = "vertical",
  geojsonWorld,
}: {
  height?: number;
  width?: number;
  countries?: string[];
  region?: MapRegion;
  grid?: DottedMapGrid;
  geojsonWorld: GeoJsonFeatureCollection;
}): MapData => {
  if (height <= 0 && width <= 0) {
    throw new Error("height or width is required");
  }

  const geojsonByCountry = geojsonWorld.features.reduce<Record<string, GeoJsonFeature>>(
    (acc, feature) => {
      if (feature.id) acc[feature.id] = feature;
      return acc;
    },
    {},
  );

  let geojson: GeoJsonFeatureCollection = geojsonWorld;
  let effectiveRegion = region;

  if (countries.length > 0) {
    geojson = {
      type: "FeatureCollection",
      features: countries.map((country) => geojsonByCountry[country]).filter(Boolean),
    };

    if (!effectiveRegion) {
      effectiveRegion = computeGeojsonBox(geojson);
    }
  } else if (!effectiveRegion) {
    effectiveRegion = DEFAULT_WORLD_REGION;
  }

  const [X_MIN, Y_MIN] = project(undefined, [effectiveRegion.lng.min, effectiveRegion.lat.min]);
  const [X_MAX, Y_MAX] = project(undefined, [effectiveRegion.lng.max, effectiveRegion.lat.max]);
  const X_RANGE = X_MAX - X_MIN;
  const Y_RANGE = Y_MAX - Y_MIN;

  if (width <= 0) {
    width = Math.round((height * X_RANGE) / Y_RANGE);
  } else if (height <= 0) {
    height = Math.round((width * Y_RANGE) / X_RANGE);
  }

  const points: Record<string, DottedMapPoint> = {};
  const ystep = grid === "diagonal" ? Math.sqrt(3) / 2 : 1;

  for (let y = 0; y * ystep < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const localx = y % 2 === 0 && grid === "diagonal" ? x + 0.5 : x;
      const localy = y * ystep;

      const pointGoogle: [number, number] = [
        (localx / width) * X_RANGE + X_MIN,
        Y_MAX - (localy / height) * Y_RANGE,
      ];
      const wgs84Point = project("GOOGLE", "WGS84", pointGoogle);

      const countryFeature = geojson.features.find((feature) =>
        inside(wgs84Point as unknown as any, feature as any),
      );
      if (countryFeature) {
        const [lng, lat] = wgs84Point;
        points[[x, y].join(";")] = { x: localx, y: localy, lat, lng, countryId: countryFeature.id };
      }
    }
  }

  return {
    points,
    X_MIN,
    Y_MIN,
    X_MAX,
    Y_MAX,
    X_RANGE,
    Y_RANGE,
    region: effectiveRegion,
    grid,
    height,
    width,
    ystep,
  };
};

export const getPin = (map: MapData, { lat, lng }: { lat: number; lng: number }) => {
  const [googleX, googleY] = project(undefined, [lng, lat]);

  let [rawX, rawY] = [
    (map.width * (googleX - map.X_MIN)) / map.X_RANGE,
    (map.height * (map.Y_MAX - googleY)) / map.Y_RANGE,
  ];

  const y = Math.round(rawY / map.ystep);
  if (y % 2 === 0 && map.grid === "diagonal") {
    rawX -= 0.5;
  }

  const x = Math.round(rawX);
  let [localx, localy] = [x, Math.round(y) * map.ystep];
  if (y % 2 === 0 && map.grid === "diagonal") {
    localx += 0.5;
  }

  const [localLng, localLat] = project("GOOGLE", "WGS84", [
    (localx * map.X_RANGE) / map.width + map.X_MIN,
    map.Y_MAX - (localy * map.Y_RANGE) / map.height,
  ]);

  return { x: localx, y: localy, lat: localLat, lng: localLng };
};
