import { defineComponent, useAttrs, type PropType } from "vue";
import { LinearGradient } from "./LinearGradient";

export const GradientOrangeRed = defineComponent({
  name: "GradientOrangeRed",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: "#FCE38A" },
    to: { type: String, default: "#F38181" },
  },
  setup(props) {
    const attrs = useAttrs();
    return () => <LinearGradient id={props.id} from={props.from} to={props.to} {...attrs} />;
  },
});
