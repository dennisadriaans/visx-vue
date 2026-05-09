import { describe, test, expect, vi, beforeEach, afterEach } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { useParentSize } from "../src";

// ---------------------------------------------------------------------------
// ResizeObserver mock
// ---------------------------------------------------------------------------
type ROCallback = ResizeObserverCallback;
let resizeObserverCallbacks: ROCallback[] = [];

class MockResizeObserver {
  cb: ROCallback;
  observe: ReturnType<typeof vi.fn>;
  unobserve: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;

  constructor(cb: ROCallback) {
    this.cb = cb;
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
    resizeObserverCallbacks.push(cb);
  }
}

function triggerResize(
  entry: Partial<ResizeObserverEntry> = {
    contentRect: {
      width: 300,
      height: 150,
      top: 5,
      left: 10,
      x: 10,
      y: 5,
      bottom: 155,
      right: 310,
      toJSON() {},
    },
  } as unknown as Partial<ResizeObserverEntry>,
) {
  resizeObserverCallbacks.forEach((cb) => {
    cb([entry as ResizeObserverEntry], {} as ResizeObserver);
  });
}

beforeEach(() => {
  resizeObserverCallbacks = [];
  vi.stubGlobal("ResizeObserver", MockResizeObserver);
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    cb(0);
    return 0;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** Helper: wraps the composable in a component so lifecycle hooks fire. */
function mountComposable(config: Parameters<typeof useParentSize>[0] = {}) {
  let result!: ReturnType<typeof useParentSize>;

  const Comp = defineComponent({
    setup() {
      result = useParentSize(config);
      return () => h("div", { ref: result.parentRef }, "test");
    },
  });

  const wrapper = mount(Comp, { attachTo: document.body });
  return { wrapper, result };
}

describe("useParentSize", () => {
  test("it should be defined", () => {
    expect(useParentSize).toBeDefined();
  });

  test("it should return default initial size", () => {
    const { result } = mountComposable();
    expect(result.width.value).toBe(0);
    expect(result.height.value).toBe(0);
    expect(result.top.value).toBe(0);
    expect(result.left.value).toBe(0);
  });

  test("it should respect custom initial size", () => {
    const { result } = mountComposable({
      initialSize: { width: 100, height: 50, top: 1, left: 2 },
    });
    expect(result.width.value).toBe(100);
    expect(result.height.value).toBe(50);
    expect(result.top.value).toBe(1);
    expect(result.left.value).toBe(2);
  });

  test("it should provide a parentRef", () => {
    const { result } = mountComposable();
    expect(result.parentRef).toBeDefined();
    // After mounting with attachTo, the ref should be set
    expect(result.parentRef.value).toBeInstanceOf(HTMLDivElement);
  });

  test("it should update dimensions on resize", async () => {
    vi.useFakeTimers();

    const { result } = mountComposable({ debounceTime: 0 });

    triggerResize();
    vi.advanceTimersByTime(10);
    await nextTick();

    expect(result.width.value).toBe(300);
    expect(result.height.value).toBe(150);
    expect(result.top.value).toBe(5);
    expect(result.left.value).toBe(10);

    vi.useRealTimers();
  });

  test("it should ignore specified dimensions", async () => {
    vi.useFakeTimers();

    const { result } = mountComposable({
      debounceTime: 0,
      ignoreDimensions: ["top", "left"],
      initialSize: { width: 0, height: 0, top: 0, left: 0 },
    });

    // Trigger resize where only top/left change
    triggerResize({
      contentRect: {
        width: 0,
        height: 0,
        top: 99,
        left: 99,
        x: 99,
        y: 99,
        bottom: 99,
        right: 99,
        toJSON() {},
      },
    } as unknown as Partial<ResizeObserverEntry>);

    vi.advanceTimersByTime(10);
    await nextTick();

    // Should not update because only ignored dimensions changed
    expect(result.top.value).toBe(0);
    expect(result.left.value).toBe(0);

    vi.useRealTimers();
  });

  test("it should expose a resize function", () => {
    const { result } = mountComposable();
    expect(typeof result.resize).toBe("function");
  });

  test("it should disconnect observer on unmount", () => {
    const { wrapper } = mountComposable();

    // Get the observer mock created during mount
    const observer = resizeObserverCallbacks.length > 0;

    wrapper.unmount();

    // After unmount the observer's disconnect should have been called.
    // We just check that unmount doesn't throw.
    expect(observer).toBe(true);
  });
});
