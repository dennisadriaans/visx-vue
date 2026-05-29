<script setup lang="ts">
import { computed } from 'vue'
import { Group } from '@visx-vue/group'
import { ViolinPlot, BoxPlot } from '@visx-vue/stats'
import { LinearGradient } from '@visx-vue/gradient'
import { scaleBand, scaleLinear } from '@visx-vue/scale'
import { genStats, getSeededRandom, getRandomNormal } from '@visx-vue/mock-data'
import { useTooltip, Tooltip, defaultStyles } from '@visx-vue/tooltip'
import { PatternLines } from '@visx-vue/pattern'
import { useParentSize } from '@visx-vue/responsive'

const { parentRef, width, height: rawHeight } = useParentSize()
const height = computed(() => rawHeight.value || 400)

const seededRandom = getSeededRandom(0.1)
const randomNormal = getRandomNormal.source(getSeededRandom(0.789))(4, 3)
const data = genStats(5, randomNormal, () => 10 * seededRandom())

const getX = (d: (typeof data)[0]) => d.boxPlot.x
const getMin = (d: (typeof data)[0]) => d.boxPlot.min
const getMax = (d: (typeof data)[0]) => d.boxPlot.max
const getMedian = (d: (typeof data)[0]) => d.boxPlot.median
const getFirstQ = (d: (typeof data)[0]) => d.boxPlot.firstQuartile
const getThirdQ = (d: (typeof data)[0]) => d.boxPlot.thirdQuartile
const getOutliers = (d: (typeof data)[0]) => d.boxPlot.outliers

const xMax = computed(() => width.value)
const yMax = computed(() => height.value - 120)

const xScale = computed(() =>
  scaleBand<string>({
    range: [0, xMax.value],
    round: true,
    domain: data.map(getX),
    padding: 0.4
  })
)

const allValues = data.flatMap((d) => [d.boxPlot.min, d.boxPlot.max])
const yScale = computed(() =>
  scaleLinear<number>({
    range: [yMax.value, 0],
    round: true,
    domain: [Math.min(...allValues), Math.max(...allValues)]
  })
)

const boxWidth = computed(() => xScale.value.bandwidth())
const constrainedWidth = computed(() => Math.min(40, boxWidth.value))

interface TooltipData {
  name?: string
  min?: number
  median?: number
  max?: number
  firstQuartile?: number
  thirdQuartile?: number
}

const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, showTooltip, hideTooltip } =
  useTooltip<TooltipData>()

const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: '#283238',
  color: 'white'
}
</script>

<template>
  <ExamplePage
    title="Stats Plot"
    description="Box plots and violin plots combining ViolinPlot and BoxPlot with interactive tooltips."
    :packages="['@visx-vue/stats', '@visx-vue/scale', '@visx-vue/gradient', '@visx-vue/tooltip']"
  >
    <div
      ref="parentRef"
      class="w-full relative bg-elevated/40 rounded-xl"
      style="height: 500px"
    >
      <svg
        v-if="width > 10"
        :width="width"
        :height="height"
      >
        <LinearGradient
          id="statsplot"
          to="#00DC82"
          from="#00b368"
        />
        <rect
          x="0"
          y="0"
          :width="width"
          :height="height"
          fill="transparent"
          rx="14"
        />
        <PatternLines
          id="hViolinLines"
          :height="3"
          :width="3"
          stroke="#ced4da"
          stroke-width="1"
          :orientation="['horizontal']"
        />
        <Group :top="40">
          <g
            v-for="(d, i) in data"
            :key="i"
          >
            <ViolinPlot
              :data="d.binData"
              stroke="#dee2e6"
              :left="xScale(getX(d))!"
              :width="constrainedWidth"
              :value-scale="yScale"
              fill="url(#hViolinLines)"
            />
            <BoxPlot
              :min="getMin(d)"
              :max="getMax(d)"
              :left="xScale(getX(d))! + 0.3 * constrainedWidth"
              :first-quartile="getFirstQ(d)"
              :third-quartile="getThirdQ(d)"
              :median="getMedian(d)"
              :box-width="constrainedWidth * 0.4"
              fill="#FFFFFF"
              :fill-opacity="0.3"
              stroke="#FFFFFF"
              :stroke-width="2"
              :value-scale="yScale"
              :outliers="getOutliers(d)"
              :min-props="{
                onMouseOver: () =>
                  showTooltip({
                    tooltipTop: (yScale(getMin(d)) ?? 0) + 40,
                    tooltipLeft: (xScale(getX(d)) ?? 0) + constrainedWidth + 5,
                    tooltipData: { min: getMin(d), name: getX(d) }
                  }),
                onMouseLeave: hideTooltip
              }"
              :max-props="{
                onMouseOver: () =>
                  showTooltip({
                    tooltipTop: (yScale(getMax(d)) ?? 0) + 40,
                    tooltipLeft: (xScale(getX(d)) ?? 0) + constrainedWidth + 5,
                    tooltipData: { max: getMax(d), name: getX(d) }
                  }),
                onMouseLeave: hideTooltip
              }"
              :box-props="{
                onMouseOver: () =>
                  showTooltip({
                    tooltipTop: (yScale(getMedian(d)) ?? 0) + 40,
                    tooltipLeft: (xScale(getX(d)) ?? 0) + constrainedWidth + 5,
                    tooltipData: { ...d.boxPlot, name: getX(d) }
                  }),
                onMouseLeave: hideTooltip
              }"
              :median-props="{
                style: { stroke: 'white' },
                onMouseOver: () =>
                  showTooltip({
                    tooltipTop: (yScale(getMedian(d)) ?? 0) + 40,
                    tooltipLeft: (xScale(getX(d)) ?? 0) + constrainedWidth + 5,
                    tooltipData: { median: getMedian(d), name: getX(d) }
                  }),
                onMouseLeave: hideTooltip
              }"
            />
          </g>
        </Group>
      </svg>
      <Tooltip
        v-if="tooltipOpen && tooltipData"
        :top="tooltipTop"
        :left="tooltipLeft"
        :style="tooltipStyles"
      >
        <div>
          <strong>{{ tooltipData.name }}</strong>
        </div>
        <div style="margin-top: 5px; font-size: 12px">
          <div v-if="tooltipData.max">max: {{ tooltipData.max }}</div>
          <div v-if="tooltipData.thirdQuartile">
            third quartile: {{ tooltipData.thirdQuartile }}
          </div>
          <div v-if="tooltipData.median">median: {{ tooltipData.median }}</div>
          <div v-if="tooltipData.firstQuartile">
            first quartile: {{ tooltipData.firstQuartile }}
          </div>
          <div v-if="tooltipData.min">min: {{ tooltipData.min }}</div>
        </div>
      </Tooltip>
    </div>
  </ExamplePage>
</template>
