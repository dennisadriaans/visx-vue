---
title: tooltip
description: visx-vue-tooltip provides tooltip hooks and components.
---

# @visx-vue/tooltip

The `@visx-vue/tooltip` package provides components and hooks for creating tooltips for your visualizations.

## Installation

```bash
pnpm add @visx-vue/tooltip
```

## Components

- **Tooltip**: A simple HTML tooltip.
- **TooltipWithBounds**: A tooltip that intelligently positions itself within a container's bounds.
- **TooltipInPortal**: A tooltip rendered in a portal (outside the main SVG).

## Hooks

- **useTooltip**: A composable for managing tooltip state (`showTooltip`, `hideTooltip`, `tooltipData`, etc.).
- **useTooltipInPortal**: A hook for managing tooltips within portals.

## Usage Example

```vue
<script setup lang="ts">
import { useTooltip, Tooltip } from '@visx-vue/tooltip'

const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip()
</script>

<template>
  <div style="position: relative;">
    <svg
      width="200"
      height="200"
    >
      <rect
        width="100"
        height="100"
        @mousemove="
          (e) =>
            showTooltip({
              tooltipData: 'Rectangle tooltip',
              tooltipLeft: e.clientX,
              tooltipTop: e.clientY
            })
        "
        @mouseleave="hideTooltip"
      />
    </svg>

    <Tooltip
      v-if="tooltipOpen"
      :top="tooltipTop"
      :left="tooltipLeft"
    >
      {{ tooltipData }}
    </Tooltip>
  </div>
</template>
```
