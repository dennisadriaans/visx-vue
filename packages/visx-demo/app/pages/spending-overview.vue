<script setup lang="ts">
import VisBarChart from "~/components/Charts/Bar/VisBarChart.vue";

useHead({ title: "Spending Overview — visx-vue" });

interface MonthDatum {
  id: number;
  month: string;
  value: number;
}

// Monthly spending data — one entry per month, matching the screenshot
const monthlySpending: MonthDatum[] = [
  { id: 1, month: "Jan", value: 3450 },
  { id: 2, month: "Feb", value: 3300 },
  { id: 3, month: "Mar", value: 3900 },
  { id: 4, month: "Apr", value: 3600 },
  { id: 5, month: "May", value: 3150 },
  { id: 6, month: "Jun", value: 4350 },
  { id: 7, month: "Jul", value: 3250 },
  { id: 8, month: "Aug", value: 4200 },
  { id: 9, month: "Sep", value: 3250 },
  { id: 10, month: "Oct", value: 3050 },
  { id: 11, month: "Nov", value: 3900 },
  { id: 12, month: "Dec", value: 3500 },
];

// Use only the month label for x-axis — no unique key needed for the chart accessor
const getMonth = (d: MonthDatum) => d.month;
const getValue = (d: MonthDatum) => d.value;

function formatDollar(v: number) {
  return `$${v.toLocaleString("en-US")}`;
}
</script>

<template>
  <ExamplePage
    title="Spending Overview"
    description="A composite VisBarChart component — 'man in the middle' API that wraps visx-vue primitives behind a clean, Unovis-style interface."
    :packages="[
      '@visx-vue/shape',
      '@visx-vue/scale',
      '@visx-vue/axis',
      '@visx-vue/grid',
      '@visx-vue/tooltip',
      '@visx-vue/responsive',
      '@visx-vue/group',
    ]"
  >
    <UCard variant="soft" class="max-w-5xl mx-auto">
      <template #header>
        <h2 class="text-xl font-bold text-highlighted m-0 mb-1">Spending overview</h2>
        <p class="text-sm text-muted m-0">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
        </p>
      </template>

      <div class="p-4 pb-1 text-default">
        <VisBarChart
          :data="monthlySpending"
          :x="getMonth"
          :y="getValue"
          :data-key="(d) => d.id"
          :y-format="formatDollar"
          series-label="Monthly Spending"
          color="var(--color-primary-500)"
          :height="280"
          :margin="{ top: 16, right: 16, bottom: 36, left: 60 }"
          :num-ticks-y="5"
          :band-padding="0.2"
        />
      </div>

      <template #footer>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-sm text-muted">
            <span class="inline-block w-2 h-2 rounded-full bg-primary shrink-0" />
            <span>Mobile revenue</span>
          </div>
          <UButton
            variant="ghost"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            class="font-semibold text-highlighted"
          >
            View Details
          </UButton>
        </div>
      </template>
    </UCard>
  </ExamplePage>
</template>

<script setup lang="ts"></script>

<style scoped></style>
