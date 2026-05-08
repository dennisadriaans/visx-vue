import { describe, it, expect, beforeEach, afterEach } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Label } from "../src";
import { addMock, removeMock } from "./svgMock";

describe("<Label />", () => {
  beforeEach(addMock);
  afterEach(removeMock);

  it("should be defined", () => {
    expect(Label).toBeDefined();
  });

  it("should render title text", async () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <Label title="title" />
          </svg>
        );
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("title");
  });

  it("should render subtitle text", async () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <Label title="title" subtitle="subtitle" />
          </svg>
        );
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("subtitle");
  });

  it("should render background", () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <Label title="title" showBackground={true} />
          </svg>
        );
      },
    });

    expect(wrapper.find("rect").exists()).toBe(true);
  });

  it("should render anchor line", () => {
    const wrapper = mount({
      render() {
        return (
          <svg>
            <Label title="title" showAnchorLine={true} />
          </svg>
        );
      },
    });

    expect(wrapper.find("line").exists()).toBe(true);
  });
});
