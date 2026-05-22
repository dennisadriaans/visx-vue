import { computed, defineComponent, ref, useSlots, watch, type PropType } from "vue";
import { DottedMapCore } from "./DottedMapCore";
import { MapLegend } from "./MapLegend";
import { USA_PINS, WORLD_PINS } from "./pins";
import { COUNTRIES, DEFAULT_ZOOM, REGIONS } from "./regions";
import { useMapPanZoom } from "./useMapPanZoom";
import type {
  DottedMapPoint,
  DottedMapProps,
  MapLegendItem,
  MapPin,
  MapRegionName,
  MapVariant,
} from "./types";

const toCssDimension = (value?: string | number) => {
  if (value == null) return "100%";
  return typeof value === "number" ? `${value}px` : value;
};

export type HighLevelDottedMapProps = DottedMapProps & {
  regionName?: MapRegionName;
  defaultZoom?: number;
  legend?: MapLegendItem[];
  maxHeight?: string | number;
};

export const DottedMap = defineComponent({
  name: "DottedMap",
  props: {
    regionName: { type: String as PropType<MapRegionName>, default: "world" },
    defaultZoom: { type: Number as PropType<number>, default: undefined },
    legend: { type: Array as PropType<MapLegendItem[]>, default: undefined },
    maxHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
    mapHeight: { type: Number as PropType<number>, default: undefined },
    mapWidth: { type: Number as PropType<number>, default: undefined },
    countries: { type: Array as PropType<string[]>, default: undefined },
    region: { type: Object as PropType<DottedMapProps["region"]>, default: undefined },
    grid: { type: String as PropType<DottedMapProps["grid"]>, default: undefined },
    avoidOuterPins: { type: Boolean as PropType<boolean>, default: false },
    pins: { type: Array as PropType<MapPin[]>, default: undefined },
    precomputedMap: {
      type: [String, Object] as PropType<DottedMapProps["precomputedMap"]>,
      default: undefined,
    },
    color: { type: String as PropType<string>, default: undefined },
    dotSize: { type: Number as PropType<number>, default: undefined },
    strokeColor: { type: String as PropType<string>, default: undefined },
    strokeWidth: { type: Number as PropType<number>, default: undefined },
    strokeOpacity: { type: Number as PropType<number>, default: undefined },
    shape: { type: String as PropType<DottedMapProps["shape"]>, default: undefined },
    countryColors: { type: Object as PropType<Record<string, string>>, default: undefined },
    backgroundColor: { type: String as PropType<string>, default: undefined },
  },
  emits: {
    "pin-click": (_pin: DottedMapPoint) => true,
    "point-click": (_event: MouseEvent, _point: DottedMapPoint) => true,
    "pin-add": (_pin: MapPin) => true,
    "pin-remove": (_pin: MapPin, _index: number) => true,
  },
  setup(props, { emit, expose }) {
    const slots = useSlots();
    const { offset, onMouseDown, onWheel, resetView, scale, wasClick, zoomIn, zoomOut } =
      useMapPanZoom();
    const internalPins = ref<MapPin[]>([]);

    const variant = computed<MapVariant>(() => {
      const regionConfig = REGIONS[props.regionName ?? "world"];
      const countries = COUNTRIES[props.regionName ?? "world"];
      const resolvedDefaultZoom = DEFAULT_ZOOM[props.regionName ?? "world"] ?? 1;
      const defaultPins = props.regionName === "usa" ? USA_PINS : WORLD_PINS;

      const base: MapVariant = {
        region: props.region ?? regionConfig,
        countries: props.countries ?? countries,
        pins: props.pins ?? defaultPins,
        defaultZoom: props.defaultZoom ?? resolvedDefaultZoom,
        color: props.color,
        countryColors: props.countryColors,
        dotSize: props.dotSize,
        grid: props.grid,
        mapHeight: props.mapHeight,
        mapWidth: props.mapWidth,
        shape: props.shape,
        strokeWidth: props.strokeWidth,
        strokeOpacity: props.strokeOpacity,
      };

      if (props.region || props.countries || props.mapHeight || props.mapWidth) {
        return base;
      }

      switch (props.regionName) {
        case "europe":
          return { ...base, dotSize: props.dotSize ?? 0.3 };
        case "usa":
          return { ...base, mapWidth: 130, dotSize: props.dotSize ?? 0.3 };
        case "asia":
          return { ...base, grid: props.grid ?? "vertical" };
        case "oceania":
          return { ...base, dotSize: props.dotSize ?? 0.3 };
        default:
          return { ...base, grid: props.grid ?? "vertical" };
      }
    });

    const activePins = computed(() => props.pins ?? internalPins.value);

    const resetInternalPins = () => {
      if (props.pins) return;
      internalPins.value = [...(variant.value.pins ?? [])];
    };

    const handlePinClick = (pin: DottedMapPoint) => {
      if (wasClick()) emit("pin-click", pin);
    };

    const handlePointClick = (event: MouseEvent, point: DottedMapPoint) => {
      if (!wasClick()) return;

      emit("point-click", event, point);
      if (props.pins || point.isPin) return;

      const index = internalPins.value.findIndex(
        (pin) => Math.abs(pin.lat - point.lat) < 0.0001 && Math.abs(pin.lng - point.lng) < 0.0001,
      );

      if (index > -1) {
        const removed = internalPins.value.splice(index, 1)[0];
        emit("pin-remove", removed, index);
        return;
      }

      const newPin: MapPin = {
        lat: point.lat,
        lng: point.lng,
        svgOptions: { color: "var(--ui-text)", radius: 0.15 },
        data: { city: "Custom Pin", region: "Other" },
      };
      internalPins.value.push(newPin);
      emit("pin-add", newPin);
    };

    watch(
      [() => props.regionName, () => props.defaultZoom, () => props.pins],
      () => {
        resetInternalPins();
        resetView(variant.value.defaultZoom);
      },
      { immediate: true },
    );

    expose({
      zoomIn,
      zoomOut,
      resetView: () => resetView(variant.value.defaultZoom),
    });

    return () => (
      <div
        class="visx-vue-dotted-map"
        style={{
          height: toCssDimension(props.maxHeight),
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          class="visx-vue-dotted-map__viewport"
          style={{
            alignItems: "center",
            cursor: "grab",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            touchAction: "none",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`,
            userSelect: "none",
            width: "100%",
          }}
          onMousedown={onMouseDown}
          onWheel={onWheel}
        >
          <DottedMapCore
            mapHeight={variant.value.mapHeight ?? 60}
            mapWidth={variant.value.mapWidth}
            color={variant.value.color ?? "var(--ui-text-dimmed, #6b7280)"}
            dotSize={variant.value.dotSize ?? 0.36}
            grid={variant.value.grid}
            shape={variant.value.shape}
            countries={variant.value.countries}
            region={variant.value.region}
            pins={activePins.value}
            strokeColor={props.strokeColor}
            strokeWidth={variant.value.strokeWidth}
            strokeOpacity={variant.value.strokeOpacity}
            countryColors={variant.value.countryColors}
            avoidOuterPins={props.avoidOuterPins}
            precomputedMap={props.precomputedMap}
            backgroundColor={props.backgroundColor}
            style={{ height: "100%", width: "100%" }}
            onPinClick={handlePinClick}
            onPointClick={handlePointClick}
          />
        </div>

        {(slots.legend || props.legend?.length) && (
          <div
            style={{
              bottom: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              position: "absolute",
              right: "1rem",
            }}
          >
            {slots.legend ? (
              slots.legend()
            ) : props.legend?.length ? (
              <MapLegend items={props.legend} />
            ) : null}
          </div>
        )}

        {slots.default?.()}
      </div>
    );
  },
});
