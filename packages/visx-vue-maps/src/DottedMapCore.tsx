import { computed, defineComponent, useAttrs, useSlots, type PropType } from "vue";
import countriesGeoJson from "./data/countries.geo.json";
import { getMap, getPin } from "./mapUtils";
import type {
  DottedMapCoreSlotProps,
  DottedMapPoint,
  DottedMapProps,
  MapData,
  MapPin,
} from "./types";

export const DottedMapCore = defineComponent({
  name: "DottedMapCore",
  inheritAttrs: false,
  props: {
    mapHeight: { type: Number as PropType<number>, default: undefined },
    mapWidth: { type: Number as PropType<number>, default: undefined },
    countries: { type: Array as PropType<string[]>, default: undefined },
    region: { type: Object as PropType<DottedMapProps["region"]>, default: undefined },
    grid: { type: String as PropType<DottedMapProps["grid"]>, default: "vertical" },
    avoidOuterPins: { type: Boolean as PropType<boolean>, default: false },
    pins: { type: Array as PropType<MapPin[]>, default: undefined },
    precomputedMap: { type: [String, Object] as PropType<string | MapData>, default: undefined },
    color: { type: String as PropType<string>, default: "#ffffff" },
    dotSize: { type: Number as PropType<number>, default: 0.5 },
    strokeColor: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: Number as PropType<number>, default: 0 },
    strokeOpacity: { type: Number as PropType<number>, default: 1 },
    shape: { type: String as PropType<DottedMapProps["shape"]>, default: "circle" },
    countryColors: { type: Object as PropType<Record<string, string>>, default: undefined },
    backgroundColor: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    "pin-click": (_point: DottedMapPoint) => true,
    "point-click": (_event: MouseEvent, _point: DottedMapPoint) => true,
  },
  setup(props, { emit }) {
    const attrs = useAttrs();
    const slots = useSlots();

    const mapInstance = computed<MapData>(() => {
      const map = props.precomputedMap
        ? typeof props.precomputedMap === "string"
          ? (JSON.parse(props.precomputedMap) as MapData)
          : props.precomputedMap
        : getMap({
            height: props.mapHeight,
            width: props.mapWidth,
            countries: props.countries ?? [],
            region: props.region,
            grid: props.grid,
            geojsonWorld: countriesGeoJson as any,
          });

      if (props.pins?.length) {
        props.pins.forEach((pin) => {
          if (!Number.isFinite(pin.lat) || !Number.isFinite(pin.lng)) return;

          const pinPoint = getPin(map, { lat: pin.lat, lng: pin.lng });
          const key = [pinPoint.x, pinPoint.y].join(";");
          map.points[key] = {
            ...pinPoint,
            isPin: true,
            data: pin.data,
            svgOptions: {
              radius: props.dotSize,
              strokeColor: props.strokeColor,
              strokeWidth: props.strokeWidth,
              strokeOpacity: props.strokeOpacity,
              ...pin.svgOptions,
            },
          };
        });
      }

      return map;
    });

    const data = computed<DottedMapPoint[]>(() => {
      const points = Object.values(mapInstance.value.points);
      if (points.length === 0) return [];

      const yValues = points.map((point) => point.y);
      const maxY = Math.max(...yValues);
      const minY = Math.min(...yValues);

      return points.map((point) => ({
        ...point,
        y: maxY + minY - point.y,
      }));
    });

    const svgContent = computed(() => {
      const map = mapInstance.value;
      const { width, height, points } = map;

      const getPointSvg = (point: DottedMapPoint) => {
        const radius = point.svgOptions?.radius || props.dotSize;
        const countryColor =
          point.countryId && props.countryColors ? props.countryColors[point.countryId] : null;
        const fillColor = point.svgOptions?.color || countryColor || props.color;
        const strokeColor = point.svgOptions?.strokeColor || props.strokeColor || fillColor;
        const strokeWidth = point.svgOptions?.strokeWidth ?? props.strokeWidth;
        const strokeOpacity = point.svgOptions?.strokeOpacity ?? props.strokeOpacity;
        const strokeAttrs =
          strokeWidth && strokeWidth > 0
            ? `stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}"`
            : "";

        if (props.shape === "hexagon") {
          const sqrt3radius = Math.sqrt(3) * radius;
          const polyPoints = [
            [point.x + sqrt3radius, point.y - radius],
            [point.x + sqrt3radius, point.y + radius],
            [point.x, point.y + 2 * radius],
            [point.x - sqrt3radius, point.y + radius],
            [point.x - sqrt3radius, point.y - radius],
            [point.x, point.y - 2 * radius],
          ];
          return `<polyline points="${polyPoints.map((polyPoint) => polyPoint.join(",")).join(" ")}" fill="${fillColor}" ${strokeAttrs} />`;
        }

        return `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${fillColor}" ${strokeAttrs} />`;
      };

      const pointsSvg = Object.values(points).map(getPointSvg).join("\n");
      const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="background-color: ${props.backgroundColor ?? "transparent"}; width: 100%; height: 100%; display: block;">${pointsSvg}</svg>`;

      let pointIndex = 0;
      return svg.replace(/<(circle|polyline)/g, (_match, type: string) => {
        return `<${type} data-index="${pointIndex++}" style="cursor: pointer;"`;
      });
    });

    const handleSvgClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const pointElement = target?.closest?.("[data-index]") as HTMLElement | null;
      const index = pointElement?.getAttribute("data-index");
      if (index == null) return;

      const point = data.value[Number(index)];
      if (!point) return;

      if (point.isPin) emit("pin-click", point);
      emit("point-click", event, point);
    };

    return () => {
      const slotProps: DottedMapCoreSlotProps = {
        points: data.value,
        map: mapInstance.value,
        svg: svgContent.value,
      };

      return (
        <div
          {...attrs}
          class={["visx-vue-dotted-map-core", attrs.class]}
          style={[
            {
              backgroundColor: props.backgroundColor,
              height: "100%",
              position: "relative",
              width: "100%",
            },
            attrs.style as any,
          ]}
        >
          {slots.default ? (
            slots.default(slotProps)
          ) : (
            <div
              innerHTML={svgContent.value}
              onClick={handleSvgClick}
              style={{ display: "block", height: "100%", width: "100%" }}
            />
          )}
        </div>
      );
    };
  },
});
