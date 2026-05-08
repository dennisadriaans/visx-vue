import { describe, it, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { scaleLinear } from "@visx-vue/scale";
import { AnimatedGridRows } from "../src";

describe("AnimatedGridRows", () => {
  const defaultProps = {
    width: 100,
    height: 100,
    scale: scaleLinear({
      domain: [0, 10],
      range: [0, 100],
    }),
    numTicks: 5,
  };

  it("should be defined", () => {
    expect(AnimatedGridRows).toBeDefined();
  });

  it("should render without crashing", () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <AnimatedGridRows {...defaultProps} />
          </svg>
        );
      },
    });

    expect(wrapper.find("g.visx-rows").exists()).toBe(true);
  });

  it("should render with custom dimensions", () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <AnimatedGridRows {...defaultProps} width={200} />
          </svg>
        );
      },
    });

    const gridGroup = wrapper.find("g.visx-rows");
    expect(gridGroup.exists()).toBe(true);

    const lines = wrapper.findAll("line");
    expect(lines[0].attributes("x2")).toBe("200");
  });

  it("should render with custom scale", () => {
    const customScale = scaleLinear({
      domain: [0, 100],
      range: [0, 500],
    });

    const wrapper = mount({
      render() {
        return (
          <svg>
            <AnimatedGridRows {...defaultProps} scale={customScale} />
          </svg>
        );
      },
    });

    const gridGroup = wrapper.find("g.visx-rows");
    expect(gridGroup.exists()).toBe(true);
    expect(gridGroup.attributes("transform")).toBeDefined();
  });
});
