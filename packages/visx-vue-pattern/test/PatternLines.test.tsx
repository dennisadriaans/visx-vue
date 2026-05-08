import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { PatternLines } from "../src";
import type { PatternOrientationType } from "../src/constants";
import { pathForOrientation } from "../src/PatternLines";

describe("<PatternLines />", () => {
  test("should be defined", () => {
    expect(PatternLines).toBeDefined();
  });

  test("should render background when background prop is provided", () => {
    const wrapper = mount(() => (
      <svg>
        <PatternLines id="test" height={4} width={4} background="blue" />
      </svg>
    ));

    const pattern = wrapper.find("pattern");
    expect(pattern.exists()).toBe(true);

    const backgroundRect = wrapper.find("rect");
    expect(backgroundRect.exists()).toBe(true);
    expect(backgroundRect.attributes("fill")).toBe("blue");
    expect(backgroundRect.attributes("width")).toBe("4");
    expect(backgroundRect.attributes("height")).toBe("4");
  });

  test("should not render background when background prop is not provided", () => {
    const wrapper = mount(() => (
      <svg>
        <PatternLines id="test" height={4} width={4} />
      </svg>
    ));

    const backgroundRect = wrapper.find(".visx-pattern-line-background");
    expect(backgroundRect.exists()).toBe(false);
  });

  test("should render correct pattern lines based on orientation", () => {
    const size = 4;
    const orientation: PatternOrientationType[] = ["diagonal", "diagonalRightToLeft"];
    const expectedPaths = orientation.map((o) =>
      pathForOrientation({ orientation: o, height: size }),
    );

    const wrapper = mount(() => (
      <svg>
        <PatternLines id="test" height={size} width={size} orientation={orientation} />
      </svg>
    ));

    const paths = wrapper.findAll(".visx-pattern-line");
    expect(paths).toHaveLength(2);

    paths.forEach((path, index) => {
      expect(path.attributes("d")).toBe(expectedPaths[index]);
    });
  });
});
