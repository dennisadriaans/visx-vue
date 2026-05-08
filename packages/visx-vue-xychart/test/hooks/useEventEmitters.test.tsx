// @vitest-environment jsdom
import { describe, it, expect, vi } from "vite-plus/test";
import { mount, flushPromises } from "@vue/test-utils";
import { defineComponent, onMounted } from "vue";
import EventEmitterProvider from "../../src/providers/EventEmitterProvider";
import useEventEmitter from "../../src/hooks/useEventEmitter";
import useEventEmitters from "../../src/hooks/useEventEmitters";

describe("useEventEmitters", () => {
  it("should be defined", () => {
    expect(useEventEmitters).toBeDefined();
  });

  it("should provide an emitter for each callback specified", () => {
    expect.assertions(1);

    const Component = defineComponent({
      setup() {
        const emitters = useEventEmitters({
          source: "visx",
          onPointerOut: false,
          onBlur: true,
          onFocus: true,
        });
        expect(emitters).toEqual({
          onBlur: expect.any(Function),
          onFocus: expect.any(Function),
          onPointerMove: expect.any(Function),
          onPointerOut: undefined,
          onPointerUp: expect.any(Function),
          onPointerDown: expect.any(Function),
        });
        return () => null;
      },
    });

    mount(EventEmitterProvider, {
      slots: {
        default: () => <Component />,
      },
    });
  });

  it("emitters should emit events", async () => {
    expect.assertions(1);

    const source = "sourceId";
    const listener = vi.fn();

    const Component = defineComponent({
      setup() {
        useEventEmitter("pointerup", listener, [source]);
        const emitters = useEventEmitters({ source });

        onMounted(() => {
          if (emitters.onPointerUp) {
            emitters.onPointerUp(new MouseEvent("pointerup") as unknown as PointerEvent);
          }
        });

        return () => null;
      },
    });

    mount(EventEmitterProvider, {
      slots: {
        default: () => <Component />,
      },
    });

    await flushPromises();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
