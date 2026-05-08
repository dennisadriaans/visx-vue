<script setup lang="ts">
/**
 * Candlestick Chart demo — OHLC financial chart.
 */
const data = Array.from({ length: 30 }, (_, i) => {
  const base = 150 + Math.sin(i / 5) * 20;
  const open = base + (Math.random() - 0.5) * 10;
  const close = base + (Math.random() - 0.5) * 10;
  return {
    date: new Date(2024, 0, i + 1).toISOString().slice(0, 10),
    open: Math.round(open * 100) / 100,
    high: Math.round((Math.max(open, close) + Math.random() * 8) * 100) / 100,
    low: Math.round((Math.min(open, close) - Math.random() * 8) * 100) / 100,
    close: Math.round(close * 100) / 100,
  };
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-8 space-y-12">
    <h1 class="text-2xl font-bold">Candlestick Chart</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">OHLC Financial Data</h2>
      <pre
        class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto mb-4"
      ><code>&lt;CandlestickChart :data="data"&gt;
  &lt;Candlestick /&gt;
  &lt;ChartGrid /&gt;
  &lt;ChartXAxis /&gt;
  &lt;ChartYAxis /&gt;
  &lt;ChartTooltip /&gt;
&lt;/CandlestickChart&gt;</code></pre>
    </section>

    <section>
      <h2 class="text-lg font-semibold mb-4">Sample Data</h2>
      <pre class="bg-gray-100 dark:bg-gray-900 rounded p-4 text-xs overflow-auto max-h-60">{{
        JSON.stringify(data.slice(0, 5), null, 2)
      }}</pre>
    </section>
  </div>
</template>
