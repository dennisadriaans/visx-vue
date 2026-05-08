import { describe, test, expect, vi, afterEach } from "vite-plus/test";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import { Wordcloud } from "../src";
import type { WordcloudConfig } from "../src/types";

const mocked3Cloud = {
  size: vi.fn(),
  words: vi.fn(),
  random: vi.fn(),
  font: vi.fn(),
  padding: vi.fn(),
  fontSize: vi.fn(),
  fontStyle: vi.fn(),
  fontWeight: vi.fn(),
  rotate: vi.fn(),
  spiral: vi.fn(),
  on: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
};

vi.mock("d3-cloud", () => ({ default: () => mocked3Cloud }));

describe("<Wordcloud />", () => {
  afterEach(() => {
    for (const mockFn of Object.values(mocked3Cloud)) {
      mockFn.mockReset();
    }
  });

  test("it returns early if width or height is zero", () => {
    const slotSpy = vi.fn();

    const wrapper = mount(Wordcloud, {
      props: { width: 100, height: 0, words: [{ text: "bla" }] },
      slots: {
        default: slotSpy,
      },
    });

    expect(slotSpy).not.toHaveBeenCalled();

    // Remount with width=0, height=200
    const wrapper2 = mount(Wordcloud, {
      props: { width: 0, height: 200, words: [{ text: "bla" }] },
      slots: {
        default: slotSpy,
      },
    });

    expect(slotSpy).not.toHaveBeenCalled();

    wrapper.unmount();
    wrapper2.unmount();
  });

  test("it passes d3 cloud words to the default slot", () => {
    const mockWord = { text: "myMockedWord" };
    mocked3Cloud.on.mockImplementation(
      (_: unknown, setWords: (words: { text: string }[]) => void) => setWords([mockWord]),
    );

    let slotWords: unknown[] | undefined;
    const SlotCapture = defineComponent({
      setup() {
        return () =>
          h(
            Wordcloud,
            { width: 100, height: 100, words: [{ text: "bla" }] },
            {
              default: (props: { words: unknown[] }) => {
                slotWords = props.words;
                return h("text", "word");
              },
            },
          );
      },
    });

    mount(SlotCapture);

    expect(slotWords).toEqual([mockWord]);
  });

  test("it sets the config on the d3 cloud", () => {
    const wordcloudConfig: WordcloudConfig<{ text: string }> = {
      font: "Impact",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "bold",
      height: 200,
      width: 300,
      padding: 4,
      random: () => 0.5,
      rotate: 0,
      spiral: "archimedean",
      words: [{ text: "myMockedWord" }],
    };

    mount(Wordcloud, {
      props: wordcloudConfig,
      slots: {
        default: () => h("text", "word"),
      },
    });

    expect(mocked3Cloud.size).toHaveBeenCalledWith([wordcloudConfig.width, wordcloudConfig.height]);
    expect(mocked3Cloud.font).toHaveBeenCalledWith(wordcloudConfig.font);
    expect(mocked3Cloud.fontSize).toHaveBeenCalledWith(wordcloudConfig.fontSize);
    expect(mocked3Cloud.fontStyle).toHaveBeenCalledWith(wordcloudConfig.fontStyle);
    expect(mocked3Cloud.fontWeight).toHaveBeenCalledWith(wordcloudConfig.fontWeight);
    expect(mocked3Cloud.padding).toHaveBeenCalledWith(wordcloudConfig.padding);
    expect(mocked3Cloud.random).toHaveBeenCalledWith(wordcloudConfig.random);
    expect(mocked3Cloud.rotate).toHaveBeenCalledWith(wordcloudConfig.rotate);
    expect(mocked3Cloud.spiral).toHaveBeenCalledWith(wordcloudConfig.spiral);
    expect(mocked3Cloud.words).toHaveBeenCalledWith(wordcloudConfig.words);
  });
});
