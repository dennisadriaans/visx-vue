import { defineComponent, provide, type PropType } from "vue";
import type { XYChartTheme } from "../types";
import { ThemeContextKey } from "../context/ThemeContext";
import lightTheme from "../theme/themes/light";

export type ThemeProviderProps = {
  theme?: XYChartTheme;
};

const ThemeProvider = defineComponent({
  name: "ThemeProvider",
  props: {
    theme: {
      type: Object as PropType<XYChartTheme>,
      default: () => lightTheme,
    },
  },
  setup(props, { slots }) {
    provide(ThemeContextKey, props.theme);
    return () => slots.default?.();
  },
});

export default ThemeProvider;
