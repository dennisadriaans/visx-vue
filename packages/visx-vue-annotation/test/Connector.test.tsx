import { describe, it, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Connector } from "../src";

describe("<Connector />", () => {
  it("should be defined", () => {
    expect(Connector).toBeDefined();
  });

  it("should render a path", () => {
    const wrapper = mount({
      render() {
        return (
          <svg width={100} height={100}>
            <Connector />
          </svg>
        );
      },
    });

    expect(wrapper.find("path").exists()).toBe(true);
  });
});
