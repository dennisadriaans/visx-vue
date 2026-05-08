import { defineComponent, useAttrs, type PropType } from "vue";
import { LinearGradient } from "./LinearGradient";

export const GradientPinkRed = defineComponent({
  name: "GradientPinkRed",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: "#F54EA2" },
    to: { type: String, default: "#FF7676" },
  },
  setup(props) {
    const attrs = useAttrs();
    return () => <LinearGradient id={props.id} from={props.from} to={props.to} {...attrs} />;
  },
});
