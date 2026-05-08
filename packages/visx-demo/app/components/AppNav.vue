<template>
  <nav
    class="sticky top-0 z-50 w-full border-b border-default bg-white/80 backdrop-blur-md dark:bg-neutral-950/80"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3 transition-opacity hover:opacity-90">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <svg viewBox="0 0 32 32" class="h-6 w-6">
            <path d="M16 2L2 16l14 14 14-14L16 2zm0 4l10 10-10 10L6 16 16 6z" fill="currentColor" />
          </svg>
        </div>
        <span class="text-lg font-bold tracking-tight text-highlighted">visx-vue</span>
      </NuxtLink>

      <div class="flex items-center gap-2 sm:gap-6">
        <UButton to="/" variant="ghost" color="neutral" class="hidden sm:flex"> Home </UButton>
        <UButton to="/charts" variant="ghost" color="neutral"> Gallery </UButton>
        <div class="h-4 w-px bg-default mx-1 hidden sm:block" />
        <UButton
          to="https://github.com/dennisadriaans/visx-vue"
          target="_blank"
          variant="ghost"
          color="neutral"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </div>
    </div>
  </nav>
</template>
