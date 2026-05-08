import { describe, test, expect, vi } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { chord as d3Chord } from "d3-chord";
import { Ribbon } from "../src";

const matrix = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907],
];

const chords = d3Chord()(matrix);

describe("<Ribbon />", () => {
  test("it should be defined", () => {
    expect(Ribbon).toBeDefined();
  });

  test("it should call children as a function with required args", () => {
    // DEVIATION: React uses render-prop children; Vue uses scoped default slot
    const slotFn = vi.fn(({ path }: { path: string | null }) => <path d={path || ""} />);
    mount(Ribbon, {
      props: { chord: chords[0] },
      slots: { default: slotFn },
    });
    const args = slotFn.mock.calls[0][0] as { path?: unknown };
    expect(slotFn).toHaveBeenCalledTimes(1);
    expect(args.path).toBeDefined();
  });
});
