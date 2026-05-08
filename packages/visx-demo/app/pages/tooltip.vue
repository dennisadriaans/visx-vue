<script setup lang="ts">
import {
  Tooltip,
  TooltipWithBounds,
  useTooltip,
  useTooltipInPortal,
  defaultStyles,
} from "@visx-vue/tooltip";

const width = 500;
const height = 300;
const positionIndicatorSize = 8;

const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: "rgba(53,71,125,0.8)",
  color: "white",
  width: "152px",
  height: "72px",
  padding: "12px",
};

const tooltipShouldDetectBounds = ref(true);
const renderTooltipInPortal = ref(false);

const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
  scroll: true,
  detectBounds: computed(() => tooltipShouldDetectBounds.value),
});

const { showTooltip, hideTooltip, tooltipOpen, tooltipData, tooltipLeft, tooltipTop } =
  useTooltip<string>({
    tooltipOpen: true,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    tooltipData: "Move me with your mouse or finger",
  });

function handlePointerMove(event: PointerEvent) {
  const containerX = event.clientX - (containerBounds.left.value ?? 0);
  const containerY = event.clientY - (containerBounds.top.value ?? 0);
  showTooltip({
    tooltipLeft: containerX,
    tooltipTop: containerY,
    tooltipData: tooltipShouldDetectBounds.value
      ? "I detect my container boundary"
      : "I will get clipped by my container",
  });
}
</script>

<template>
  <ExamplePage
    title="Tooltip"
    description="Interactive tooltip demo with boundary detection, portal rendering, and crosshair indicators."
    :packages="['@visx-vue/tooltip']"
  >
    <template #controls>
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            :checked="tooltipShouldDetectBounds"
            @change="tooltipShouldDetectBounds = !tooltipShouldDetectBounds"
          />
          Tooltip with boundary detection
        </label>
        <button class="px-3 py-1 border border-gray-300 rounded text-sm" @click="hideTooltip">
          Hide tooltip
        </button>
        <label class="flex items-center gap-1 cursor-pointer">
          <input
            type="checkbox"
            :checked="renderTooltipInPortal"
            @click.stop="renderTooltipInPortal = !renderTooltipInPortal"
          />
          Render in Portal
        </label>
      </div>
    </template>

    <div
      :ref="
        (el) => {
          containerRef = el as HTMLElement;
        }
      "
      class="tooltip-example"
      :style="{ width: `${width}px`, height: `${height}px` }"
      @pointermove="handlePointerMove"
    >
      <template v-if="tooltipOpen">
        <div
          class="position-indicator"
          :style="{
            transform: `translate(${(tooltipLeft ?? 0) - positionIndicatorSize / 2}px, ${(tooltipTop ?? 0) - positionIndicatorSize / 2}px)`,
          }"
        />
        <div
          class="crosshair horizontal"
          :style="{ transform: `translateY(${tooltipTop ?? 0}px)` }"
        />
        <div
          class="crosshair vertical"
          :style="{ transform: `translateX(${tooltipLeft ?? 0}px)` }"
        />
        <TooltipInPortal
          v-if="renderTooltipInPortal"
          :key="Math.random()"
          :left="tooltipLeft"
          :top="tooltipTop"
          :style="tooltipStyles"
        >
          {{ tooltipData }}<br /><br />
          <strong>left</strong> {{ (tooltipLeft ?? 0).toFixed(0) }}px&nbsp;&nbsp;
          <strong>top</strong> {{ (tooltipTop ?? 0).toFixed(0) }}px
        </TooltipInPortal>
        <TooltipWithBounds
          v-else-if="tooltipShouldDetectBounds"
          :key="Math.random()"
          :left="tooltipLeft"
          :top="tooltipTop"
          :style="tooltipStyles"
        >
          {{ tooltipData }}<br /><br />
          <strong>left</strong> {{ (tooltipLeft ?? 0).toFixed(0) }}px&nbsp;&nbsp;
          <strong>top</strong> {{ (tooltipTop ?? 0).toFixed(0) }}px
        </TooltipWithBounds>
        <Tooltip
          v-else
          :key="Math.random()"
          :left="tooltipLeft"
          :top="tooltipTop"
          :style="tooltipStyles"
        >
          {{ tooltipData }}<br /><br />
          <strong>left</strong> {{ (tooltipLeft ?? 0).toFixed(0) }}px&nbsp;&nbsp;
          <strong>top</strong> {{ (tooltipTop ?? 0).toFixed(0) }}px
        </Tooltip>
      </template>
      <div v-else class="no-tooltip">Move or touch the canvas to see the tooltip</div>
      <div class="z-index-bummer">
        I have an annoying z-index.
        <span role="img" aria-label="yay">🥳</span>
      </div>
    </div>
  </ExamplePage>
</template>

<style scoped>
.tooltip-example {
  z-index: 0;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(45deg, #6c5b7b, #c06c84, #f67280);
  font-size: 14px;
  color: white;
}
.position-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #35477d;
  position: absolute;
}
.crosshair {
  position: absolute;
  top: 0;
  left: 0;
}
.crosshair.horizontal {
  width: 100%;
  height: 1px;
  border-top: 1px dashed #35477d;
}
.crosshair.vertical {
  height: 100%;
  width: 1px;
  border-left: 1px dashed #35477d;
}
.no-tooltip {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.z-index-bummer {
  position: absolute;
  right: 12%;
  bottom: 20%;
  max-width: 190px;
  z-index: 2000;
  background: rgba(255, 255, 255, 0.8);
  color: #35477d;
  border-radius: 8px;
  padding: 16px;
  line-height: 1.2em;
}
</style>
