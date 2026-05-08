import { defineComponent, useAttrs, type PropType } from "vue";
import { LinearGradient } from "./LinearGradient";

export const GradientPinkBlue = defineComponent({
  name: "GradientPinkBlue",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: "#F02FC2" },
    to: { type: String, default: "#6094EA" },
  },
  setup(props) {
    const attrs = useAttrs();
    return () => <LinearGradient id={props.id} from={props.from} to={props.to} {...attrs} />;
  },
});
