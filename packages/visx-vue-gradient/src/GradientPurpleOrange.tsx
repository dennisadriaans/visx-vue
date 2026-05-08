import { defineComponent, useAttrs, type PropType } from "vue";
import { LinearGradient } from "./LinearGradient";

export const GradientPurpleOrange = defineComponent({
  name: "GradientPurpleOrange",
  inheritAttrs: false,
  props: {
    id: { type: String as PropType<string>, required: true },
    from: { type: String, default: "#7117EA" },
    to: { type: String, default: "#EA6060" },
  },
  setup(props) {
    const attrs = useAttrs();
    return () => <LinearGradient id={props.id} from={props.from} to={props.to} {...attrs} />;
  },
});
