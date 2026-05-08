<template>
  <footer class="mt-16 border-t border-default py-12">
    <div class="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
      <div class="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
        <span class="font-semibold text-default">visx-vue</span>
        <span class="opacity-50">—</span>
        <span>
          Visualization primitives for Vue, inspired by
          <UButton
            to="https://airbnb.io/visx"
            target="_blank"
            variant="link"
            color="primary"
            class="p-0 font-medium"
          >
            visx
          </UButton>
        </span>
      </div>

      <div class="flex items-center gap-4">
        <UButton
          to="https://github.com/dennisadriaans/visx-vue"
          target="_blank"
          variant="ghost"
          color="neutral"
          icon="i-simple-icons-github"
          size="sm"
          aria-label="GitHub"
        />
      </div>
    </div>
  </footer>
</template>
