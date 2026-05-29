<template>
  <ExamplePage
    title="Wordcloud"
    :packages="['@visx-vue/wordcloud', '@visx-vue/text', '@visx-vue/scale']"
  >
    <div class="flex flex-wrap items-center gap-4 mb-4">
      <span class="text-xs text-default font-medium">Spiral type:</span>
      <USelect
        v-model="spiralType"
        :items="['archimedean', 'rectangular']"
        size="sm"
      />
      <UCheckbox
        v-model="withRotation"
        label="With rotation"
      />
    </div>
    <div
      ref="parentRef"
      class="chart-container bg-elevated/40 rounded-xl"
    >
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
      >
        <rect
          :width="width"
          :height="height"
          fill="transparent"
          :rx="14"
        />
        <Group
          :top="height / 2"
          :left="width / 2"
        >
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
import { Text } from '@visx-vue/text'
import { scaleLog } from '@visx-vue/scale'
import { Wordcloud } from '@visx-vue/wordcloud'
import { Group } from '@visx-vue/group'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Wordcloud — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

type SpiralType = 'archimedean' | 'rectangular'
const spiralType = ref<SpiralType>('archimedean')
const withRotation = ref(false)

const colors = ['#00DC82', '#00b368', '#33e394']

const totoLyrics = `I hear the drums echoing tonight But she hears only whispers of some quiet conversation She's coming in 12:30 flight The moonlit wings reflect the stars that guide me towards salvation I stopped an old man along the way Hoping to find some old forgotten words or ancient melodies He turned to me as if to say Hurry boy it's waiting there for you It's gonna take a lot to drag me away from you There's nothing that a hundred men or more could ever do I bless the rains down in Africa Gonna take some time to do the things we never had The wild dogs cry out in the night As they grow restless longing for some solitary company I know that I must do what's right As sure as Kilimanjaro rises like Olympus above the Serengeti I seek to cure what's deep inside frightened of this thing that I've become`

interface WordData {
  text: string
  value: number
}

function wordFreq(text: string): WordData[] {
  const words = text.replace(/\./g, '').split(/\s/)
  const freqMap: Record<string, number> = {}
  for (const w of words) {
    if (!freqMap[w]) freqMap[w] = 0
    freqMap[w]++
  }
  return Object.keys(freqMap).map((word) => ({ text: word, value: freqMap[word] }))
}

function getRotationDegree() {
  const rand = Math.random()
  return rand > 0.5 ? rand * 60 : rand * -60
}

const words = wordFreq(totoLyrics)
const fontScale = scaleLog({
  domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
  range: [10, 100]
})

const fontSizeSetter = (d: WordData) => fontScale(d.value)
const fixedValueGenerator = () => 0.5
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
