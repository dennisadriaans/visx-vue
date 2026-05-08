import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { PatternPath } from "../src";

describe("<PatternPath />", () => {
  test("it should be defined", () => {
    expect(PatternPath).toBeDefined();
  });

  test("it should render a rect background if background prop defined", () => {
    const wrapper = mount(() => (
      <svg>
        <PatternPath id="test" height={4} width={4} background="blue" />
      </svg>
    ));
    expect(wrapper.find("rect").exists()).toBe(true);
  });

  test("it should not render a rect background if no background prop", () => {
    const wrapper = mount(() => (
      <svg>
        <PatternPath id="test" height={4} width={4} />
      </svg>
    ));
    expect(wrapper.find("rect").exists()).toBe(false);
  });
});
