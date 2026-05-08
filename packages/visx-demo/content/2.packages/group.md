---
title: group
description: visx-vue-group provides a simple SVG group component.
---

# @visx-vue/group

The `@visx-vue/group` package provides a simple `<Group />` component that renders an SVG `<g>` element with support for `top` and `left` props for easy positioning.

## Installation

```bash
pnpm add @visx-vue/group
```

## Components

- **Group**: Renders an SVG `<g>` element.

## Usage Example

```vue
<script setup lang="ts">import { Group } from "@visx-vue/group";
</script>

<template>
  <svg width="100" height="100">
    <Group :top="10" :left="10">
      <rect width="80" height="80" fill="orange" />
    </Group>
  </svg>
</template>
```
