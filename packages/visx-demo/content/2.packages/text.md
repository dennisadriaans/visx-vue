---
title: text
description: visx-vue-text provides an SVG text component with wrapping.
---

# @visx-vue/text

The `@visx-vue/text` package provides a `<Text />` component for SVG that supports automatic text wrapping.

## Installation

```bash
pnpm add @visx-vue/text
```

## Components

- **Text**: An SVG text component that supports `width`, `verticalAnchor`, and `textAnchor`.

## Usage Example

```vue
<script setup lang="ts">import { Text } from "@visx-vue/text";
</script>

<template>
  <svg width="200" height="100">
    <Text :width="150" verticalAnchor="start" textAnchor="middle" :x="100" :y="20">
      This is a long text that will automatically wrap if it exceeds the width.
    </Text>
  </svg>
</template>
```
