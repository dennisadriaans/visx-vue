<template>
  <ExamplePage
    title="Trees"
    :packages="['@visx-vue/hierarchy', '@visx-vue/shape', '@visx-vue/gradient', '@visx-vue/group']"
  >
    <div
      ref="parentRef"
      class="chart-container bg-elevated/40 rounded-xl"
    >
      <svg
        v-if="width > 0"
        :width="width"
        :height="height"
      >
        <LinearGradient
          id="tree-lg"
          from="#00DC82"
          to="#33e394"
        />
        <rect
          :width="width"
          :height="height"
          :rx="14"
          fill="transparent"
        />
        <Tree
          :root="treeRoot"
          :size="[yMax, xMax]"
        >
          <template #default="{ tree }">
            <Group
              :top="margin.top"
              :left="margin.left"
            >
              <LinkHorizontal
                v-for="(link, i) in tree.links()"
                :key="`tree-link-${i}`"
                :data="link"
                stroke="#00DC8244"
                stroke-width="1"
                fill="none"
              />
              <template
                v-for="(node, i) in tree.descendants()"
                :key="`tree-node-${i}`"
              >
                <!-- root -->
                <Group
                  v-if="node.depth === 0"
                  :top="node.x"
                  :left="node.y"
                >
                  <circle
                    r="12"
                    fill="url(#tree-lg)"
                  />
                  <text
                    dy=".33em"
                    font-size="9"
                    font-family="Arial"
                    text-anchor="middle"
                    pointer-events="none"
                    fill="#00DC82"
                  >
                    {{ node.data.name }}
                  </text>
                </Group>
                <!-- parent -->
                <Group
                  v-else-if="node.children"
                  :top="node.x"
                  :left="node.y"
                >
                  <rect
                    :width="40"
                    :height="20"
                    y="-10"
                    x="-20"
                    fill="transparent"
                    stroke="#00DC82"
                    stroke-width="1"
                  />
                  <text
                    dy=".33em"
                    font-size="9"
                    font-family="Arial"
                    text-anchor="middle"
                    pointer-events="none"
                    fill="white"
                  >
                    {{ node.data.name }}
                  </text>
                </Group>
                <!-- leaf -->
                <Group
                  v-else
                  :top="node.x"
                  :left="node.y"
                >
                  <rect
                    :width="40"
                    :height="20"
                    y="-10"
                    x="-20"
                    fill="transparent"
                    stroke="#33e394"
                    stroke-width="1"
                    stroke-dasharray="2,2"
                    stroke-opacity="0.6"
                    rx="10"
                  />
                  <text
                    dy=".33em"
                    font-size="9"
                    font-family="Arial"
                    text-anchor="middle"
                    pointer-events="none"
                    fill="#33e394"
                  >
                    {{ node.data.name }}
                  </text>
                </Group>
              </template>
            </Group>
          </template>
        </Tree>
      </svg>
    </div>
  </ExamplePage>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Group } from '@visx-vue/group'
import { Tree, hierarchy } from '@visx-vue/hierarchy'
import { LinkHorizontal } from '@visx-vue/shape'
import { LinearGradient } from '@visx-vue/gradient'
import { useParentSize } from '@visx-vue/responsive'

useHead({ title: 'Trees — visx-vue' })

const { parentRef, width } = useParentSize({ debounceTime: 0 })
const height = computed(() => Math.round(width.value * 0.6) || 400)

const margin = { top: 10, left: 80, right: 80, bottom: 10 }

interface TreeNode {
  name: string
  isExpanded?: boolean
  children?: TreeNode[]
}

const rawTree: TreeNode = {
  name: 'T',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        { name: 'A3' },
        {
          name: 'C',
          children: [
            { name: 'C1' },
            { name: 'D', children: [{ name: 'D1' }, { name: 'D2' }, { name: 'D3' }] }
          ]
        }
      ]
    },
    { name: 'Z' },
    { name: 'B', children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }] }
  ]
}

const treeRoot = hierarchy(rawTree)

const yMax = computed(() => height.value - margin.top - margin.bottom)
const xMax = computed(() => width.value - margin.left - margin.right)
</script>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 400px;
}
</style>
