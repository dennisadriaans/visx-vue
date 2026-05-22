import { defineComponent, type PropType } from "vue";
import type { MapLegendItem } from "./types";

export const MapLegend = defineComponent({
  name: "MapLegend",
  props: {
    items: { type: Array as PropType<MapLegendItem[]>, required: true as const },
  },
  setup(props) {
    return () => (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "0.5rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
          padding: "0.75rem",
        }}
      >
        {props.items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            style={{
              alignItems: "center",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
              marginTop: index > 0 ? "0.5rem" : undefined,
            }}
          >
            <div
              style={{
                backgroundColor: item.color,
                borderRadius: "9999px",
                height: "0.5rem",
                width: "0.5rem",
              }}
            />
            <span
              style={{
                color: "#4b5563",
                fontSize: "0.75rem",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
  },
});
