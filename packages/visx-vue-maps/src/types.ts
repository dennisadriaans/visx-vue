export type MapRegion = {
  lat: { min: number; max: number };
  lng: { min: number; max: number };
};

export type MapPinSvgOptions = {
  color?: string;
  radius?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
};

export type MapPin = {
  lat: number;
  lng: number;
  svgOptions?: MapPinSvgOptions;
  data?: Record<string, unknown>;
};

export type DottedMapGrid = "vertical" | "diagonal";
export type DottedMapShape = "circle" | "hexagon";

export interface DottedMapProps {
  mapHeight?: number;
  mapWidth?: number;
  countries?: string[];
  region?: MapRegion;
  grid?: DottedMapGrid;
  avoidOuterPins?: boolean;
  pins?: MapPin[];
  precomputedMap?: string | MapData;
  color?: string;
  dotSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  shape?: DottedMapShape;
  countryColors?: Record<string, string>;
  backgroundColor?: string;
}

export type DottedMapPoint = {
  x: number;
  y: number;
  lat: number;
  lng: number;
  countryId?: string;
  isPin?: boolean;
  data?: Record<string, unknown>;
  svgOptions?: MapPinSvgOptions;
};

export interface MapData {
  points: Record<string, DottedMapPoint>;
  X_MIN: number;
  Y_MIN: number;
  X_MAX: number;
  Y_MAX: number;
  X_RANGE: number;
  Y_RANGE: number;
  region: MapRegion;
  grid: DottedMapGrid;
  height: number;
  width: number;
  ystep: number;
}

export interface DottedMapCoreSlotProps {
  points: DottedMapPoint[];
  map: MapData;
  svg: string;
}

export type MapVariant = {
  mapWidth?: number;
  mapHeight?: number;
  dotSize?: number;
  grid?: DottedMapGrid;
  shape?: DottedMapShape;
  countryColors?: Record<string, string>;
  strokeWidth?: number;
  strokeOpacity?: number;
  countries?: string[];
  region?: MapRegion;
  pins?: MapPin[];
  color?: string;
  defaultZoom?: number;
};

export type MapRegionName = "world" | "europe" | "asia" | "oceania" | "usa";

export interface MapLegendItem {
  color: string;
  label: string;
}

export interface ZoomConfig {
  min: number;
  max: number;
  step: number;
  default: number;
}
