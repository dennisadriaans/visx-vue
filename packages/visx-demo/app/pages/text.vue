<script setup lang="ts">
import { ref } from 'vue'
import { Text as VisxText } from '@visx-vue/text'

const exampleText = ref('This is really long text')
const x = ref(0)
const y = ref(0)
const svgWidth = ref(225)
const textWidth = ref(225)
const angle = ref(0)
const scaleToFit = ref(false)
const textAnchor = ref<'start' | 'middle' | 'end'>('start')
const verticalAnchor = ref<'start' | 'middle' | 'end'>('start')
const fontSize = ref('1em')
const fontFamily = ref('Arial')
const fontWeight = ref('400')
const lineHeight = ref('1em')
const showAnchor = ref(true)
const resizeSvg = ref(true)

const svgHeight = 200
</script>

<template>
  <ExamplePage
    title="Text"
    description="Interactive demo of the Text component for SVG text with word wrapping, scaling, and anchoring."
    :packages="['@visx-vue/text']"
  >
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Preview -->
      <div class="flex-none flex flex-col gap-2">
        <h6 class="font-semibold text-sm">Demo</h6>
        <svg
          :width="resizeSvg ? textWidth : 225"
          :height="svgHeight"
          style="display: block; border: 1px solid #aaa; margin-bottom: 10px"
        >
          <VisxText
            :x="x"
            :y="y"
            :width="textWidth"
            :text-anchor="textAnchor"
            :vertical-anchor="verticalAnchor"
            :line-height="lineHeight"
            :scale-to-fit="scaleToFit"
            :angle="angle"
            :style="{
              fontSize,
              fontFamily,
              fontWeight: isNaN(Number(fontWeight)) ? 200 : Number(fontWeight)
            }"
          >
            {{ exampleText }}
          </VisxText>
          <circle
            v-if="showAnchor"
            :cx="x"
            :cy="y"
            r="2"
            fill="red"
          />
        </svg>
      </div>

      <!-- Controls -->
      <div class="flex flex-col gap-2 text-sm">
        <div class="flex items-center gap-2">
          <label class="w-24">text:</label>
          <input
            v-model="exampleText"
            type="text"
            class="border border-gray-300 rounded px-2 py-0.5 w-48"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">x:</label>
          <input
            v-model.number="x"
            type="range"
            min="0"
            max="225"
            class="w-40"
          />
          <input
            v-model.number="x"
            type="number"
            class="border border-gray-300 rounded px-1 w-16"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">y:</label>
          <input
            v-model.number="y"
            type="range"
            min="0"
            :max="svgHeight"
            class="w-40"
          />
          <input
            v-model.number="y"
            type="number"
            class="border border-gray-300 rounded px-1 w-16"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">width:</label>
          <input
            v-model.number="textWidth"
            type="range"
            min="20"
            max="500"
            class="w-40"
          />
          <input
            v-model.number="textWidth"
            type="number"
            class="border border-gray-300 rounded px-1 w-16"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">angle:</label>
          <input
            v-model.number="angle"
            type="range"
            min="-180"
            max="180"
            class="w-40"
          />
          <input
            v-model.number="angle"
            type="number"
            class="border border-gray-300 rounded px-1 w-16"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">textAnchor:</label>
          <select
            v-model="textAnchor"
            class="border border-gray-300 rounded px-1"
          >
            <option value="start">start</option>
            <option value="middle">middle</option>
            <option value="end">end</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">verticalAnchor:</label>
          <select
            v-model="verticalAnchor"
            class="border border-gray-300 rounded px-1"
          >
            <option value="start">start</option>
            <option value="middle">middle</option>
            <option value="end">end</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">fontSize:</label>
          <input
            v-model="fontSize"
            type="text"
            class="border border-gray-300 rounded px-1 w-20"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">fontFamily:</label>
          <input
            v-model="fontFamily"
            type="text"
            class="border border-gray-300 rounded px-1 w-28"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">fontWeight:</label>
          <input
            v-model="fontWeight"
            type="text"
            class="border border-gray-300 rounded px-1 w-16"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="w-24">lineHeight:</label>
          <input
            v-model="lineHeight"
            type="text"
            class="border border-gray-300 rounded px-1 w-20"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 cursor-pointer">
            <input
              v-model="scaleToFit"
              type="checkbox"
            />
            scaleToFit
          </label>
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 cursor-pointer">
            <input
              v-model="showAnchor"
              type="checkbox"
            />
            show anchor point
          </label>
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 cursor-pointer">
            <input
              v-model="resizeSvg"
              type="checkbox"
            />
            resize SVG to match width
          </label>
        </div>
      </div>
    </div>
  </ExamplePage>
</template>
