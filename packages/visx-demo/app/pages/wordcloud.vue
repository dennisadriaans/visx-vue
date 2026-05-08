<template>
  <ExamplePage
    title="Wordcloud"
    :packages="['@visx-vue/wordcloud', '@visx-vue/text', '@visx-vue/scale']"
  >
    <div class="controls">
      <label>
        Spiral type &nbsp;
        <select v-model="spiralType">
          <option value="archimedean">archimedean</option>
          <option value="rectangular">rectangular</option>
        </select>
      </label>
      &nbsp;
      <label>
        With rotation &nbsp;
        <input type="checkbox" v-model="withRotation" />
      </label>
    </div>
    <div ref="parentRef" class="chart-container">
      <svg v-if="width > 0" :width="width" :height="height">
        <rect :width="width" :height="height" fill="#132231" :rx="14" />
        <Group :top="height / 2" :left="width / 2">
          <Wordcloud
            :words="words"
            :width="width"
            :height="height"
            :font-size="fontSizeSetter"
            font="Impact"
            :padding="2"
            :spiral="spiralType"
            :rotate="withRotation ? getRotationDegree : 0"
            :random="fixedValueGenerator"
          >
            <template #default="{ cloudWords }">
              <Text
                v-for="(w, i) in cloudWords"
                :key="w.text"
                :fill="colors[i % colors.length]"
                text-anchor="middle"
                :transform="`translate(${w.x}, ${w.y}) rotate(${w.rotate})`"
                :font-size="w.size"
                :font-family="w.font"
              >
                {{ w.text }}
              </Text>
            </template>
          </Wordcloud>
        </Group>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Text } from "@visx-vue/text";
import { scaleLog } from "@visx-vue/scale";
import { Wordcloud } from "@visx-vue/wordcloud";
import { Group } from "@visx-vue/group";
import { useParentSize } from "@visx-vue/responsive";

useHead({ title: "Wordcloud — visx-vue" });

const { parentRef, width } = useParentSize({ debounceTime: 0 });
const height = computed(() => Math.round(width.value * 0.6) || 400);

type SpiralType = "archimedean" | "rectangular";
const spiralType = ref<SpiralType>("archimedean");
const withRotation = ref(false);

const colors = ["#143059", "#2F6B9A", "#82a6c2"];

const totoLyrics = `I hear the drums echoing tonight But she hears only whispers of some quiet conversation She's coming in 12:30 flight The moonlit wings reflect the stars that guide me towards salvation I stopped an old man along the way Hoping to find some old forgotten words or ancient melodies He turned to me as if to say Hurry boy it's waiting there for you It's gonna take a lot to drag me away from you There's nothing that a hundred men or more could ever do I bless the rains down in Africa Gonna take some time to do the things we never had The wild dogs cry out in the night As they grow restless longing for some solitary company I know that I must do what's right As sure as Kilimanjaro rises like Olympus above the Serengeti I seek to cure what's deep inside frightened of this thing that I've become`;

interface WordData {
  text: string;
  value: number;
}

function wordFreq(text: string): WordData[] {
  const words = text.replace(/\./g, "").split(/\s/);
  const freqMap: Record<string, number> = {};
  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0;
    freqMap[w]++;
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }));
}

function getRotationDegree() {
  const rand = Math.random();
  return rand > 0.5 ? rand * 60 : rand * -60;
}

const words = wordFreq(totoLyrics);
const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [10, 100],
});

const fontSizeSetter = (d: WordData) => fontScale(d.value);
const fixedValueGenerator = () => 0.5;
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  font-size: 13px;
  flex-wrap: wrap;
}
select {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0.2rem;
}
</style>
