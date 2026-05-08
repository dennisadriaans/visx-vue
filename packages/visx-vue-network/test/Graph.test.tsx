import { describe, test, expect } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { Graph } from "../src";

describe("Graph", () => {
  test("Graph should be defined", () => {
    expect(Graph).toBeDefined();
  });
});
