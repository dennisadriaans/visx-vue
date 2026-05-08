import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { GlyphDot } from "../src";

describe("<GlyphDot />", () => {
  const mountGlyph = (props = {}) =>
    mount(() => (
      <svg>
        <GlyphDot {...props} />
      </svg>
    ));

  test("should be defined", () => {
    expect(GlyphDot).toBeDefined();
  });

  test("should render with correct class", () => {
    const wrapper = mountGlyph();
    expect(wrapper.find(".visx-glyph").exists()).toBe(true);
  });

  test("should render with custom className", () => {
    const wrapper = mountGlyph({ className: "test" });
    expect(wrapper.find(".test").exists()).toBe(true);
  });
});
