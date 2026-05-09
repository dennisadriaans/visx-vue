import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { useDrag } from "../src";

describe("useDrag", () => {
  test("it should be defined", () => {
    expect(useDrag).toBeDefined();
  });

  test("should provide UseDrag", () => {
    expect.assertions(1);

    const Comp = defineComponent({
      setup() {
        const drag = useDrag({ x: 0, y: 0 });
        expect(drag).toMatchObject({
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          isDragging: false,
          dragStart: expect.any(Function),
          dragMove: expect.any(Function),
          dragEnd: expect.any(Function),
        });
        return () => null;
      },
    });

    mount(Comp);
  });

  test("should update drag state when useDrag options change", async () => {
    expect.assertions(2);

    const options1 = { x: 1, y: 2, dx: 3, dy: 4 };
    const options2 = { x: -1, y: -2, dx: -3, dy: -4 };

    const Comp = defineComponent({
      props: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        dx: { type: Number, required: true },
        dy: { type: Number, required: true },
      },
      setup(props) {
        const drag = useDrag({
          get x() {
            return props.x;
          },
          get y() {
            return props.y;
          },
          get dx() {
            return props.dx;
          },
          get dy() {
            return props.dy;
          },
        });

        // Initial assertion – matches options1
        expect(drag).toMatchObject(options1);
        return () => h("div", `${drag.x},${drag.y},${drag.dx},${drag.dy}`);
      },
    });

    const wrapper = mount(Comp, { props: options1 });

    // Update props to options2
    await wrapper.setProps(options2);
    await nextTick();

    // DEVIATION: In Vue, the reactive state is updated via a watcher, so we
    // read the drag state through the rendered output after the watcher fires.
    // The React test asserts inside the render (including an intermediate render
    // where old state is still present). Here we assert the final state.
    expect(wrapper.text()).toBe(`${options2.x},${options2.y},${options2.dx},${options2.dy}`);
  });
});
