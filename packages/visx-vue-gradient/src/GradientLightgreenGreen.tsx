import { defineComponent, useAttrs, type PropType } from "vue";
import { LinearGradient } from "./LinearGradient";

export const GradientLightgreenGreen = defineComponent({
  name: "GradientLightgreenGreen",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: "#42E695" },
    to: { type: String, default: "#3BB2B8" },
  },
  setup(props) {
    const attrs = useAttrs();
    return () => <LinearGradient id={props.id} from={props.from} to={props.to} {...attrs} />;
  },
});
