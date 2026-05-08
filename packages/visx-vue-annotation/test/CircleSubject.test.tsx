import { describe, it, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { CircleSubject } from "../src";

describe("<CircleSubject />", () => {
  it("should be defined", () => {
    expect(CircleSubject).toBeDefined();
  });

  it("should render a circle", () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <CircleSubject x={10} y={10} />
          </svg>
        );
      },
    });

    const circle = wrapper.find("circle");
    expect(circle.exists()).toBe(true);
    expect(circle.attributes("cx")).toBe("10");
    expect(circle.attributes("cy")).toBe("10");
  });
});
