import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { Sankey } from "../src";
import type { SankeyProps } from "../src/types";

const nodes = [{ name: "node 1" }, { name: "node 2" }, { name: "node 3" }];
const links = [
  { source: 0, target: 1, value: 10 },
  { source: 1, target: 2, value: 5 },
];
const root = { nodes, links };

function renderTest(props: SankeyProps<(typeof nodes)[number], {}>) {
  const Wrapper = defineComponent({
    setup() {
      return () => h("svg", {}, [h(Sankey, props)]);
    },
  });
  return mount(Wrapper, { attachTo: document.body });
}

describe("<Sankey />", () => {
  test("it should render", () => {
    const wrapper = renderTest({ root });

    expect(wrapper.find(".visx-sankey").exists()).toBe(true);
  });

  test("it should render children", () => {
    const Wrapper = defineComponent({
      setup() {
        return () =>
          h("svg", {}, [
            h(
              Sankey,
              { root },
              {
                default: ({ graph }: { graph: { nodes: { name: string }[] } }) =>
                  graph.nodes.map((node, i) => h("text", { key: i }, node.name)),
              },
            ),
          ]);
      },
    });

    const wrapper = mount(Wrapper, { attachTo: document.body });

    expect(wrapper.text()).toContain("node 2");
  });

  test("it should render links with custom props", () => {
    const wrapper = renderTest({
      root,
      linkProps: { stroke: "red" },
      nodeProps: { fill: "blue" },
    });

    expect(wrapper.find(".visx-sankey-links > path").attributes("stroke")).toBe("red");
    expect(wrapper.find(".visx-sankey-nodes > rect").attributes("fill")).toBe("blue");
  });

  test("it should render links with custom id accessors", () => {
    const wrapper = renderTest({
      root: {
        nodes,
        links: [
          {
            source: "node 1",
            target: "node 2",
            value: 10,
          },
          {
            source: "node 2",
            target: "node 3",
            value: 5,
          },
        ],
      },
      nodeId: (node: { name: string }) => node.name,
    });

    expect(wrapper.findAll(".visx-sankey-links > path")).toHaveLength(2);
  });
});
