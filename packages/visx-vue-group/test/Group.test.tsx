import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Group } from "../src";

describe("<Group />", () => {
  test("it should be defined", () => {
    expect(Group).toBeDefined();
  });

  test("it should have class='visx-group'", () => {
    const wrapper = mount(() => (
      <svg>
        <Group />
      </svg>
    ));
    const group = wrapper.find(".visx-group");
    expect(group.exists()).toBe(true);
  });

  test("it should default props top=0 left=0", () => {
    const wrapper = mount(() => (
      <svg>
        <Group />
      </svg>
    ));
    const group = wrapper.find(".visx-group");
    expect(group.attributes("transform")).toBe("translate(0, 0)");
  });

  test("it should set props top, left, className", () => {
    const wrapper = mount(() => (
      <svg>
        <Group class-name="test" top={3} left={4} />
      </svg>
    ));
    const group = wrapper.find(".visx-group");
    expect(group.attributes("transform")).toBe("translate(4, 3)");
    expect(group.classes()).toContain("visx-group");
    expect(group.classes()).toContain("test");
  });

  test("it should set restProps", () => {
    const wrapper = mount(() => (
      <svg>
        <Group clip-path="url(#myClip)" stroke="mapleSyrup" />
      </svg>
    ));
    const group = wrapper.find(".visx-group");
    expect(group.attributes("clip-path")).toBe("url(#myClip)");
    expect(group.attributes("stroke")).toBe("mapleSyrup");
  });
});
