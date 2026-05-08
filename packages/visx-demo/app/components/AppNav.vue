<template>
  <nav class="nav">
    <div class="nav-inner wrapper">
      <NuxtLink to="/" class="logo-link">
        <svg viewBox="0 0 32 32" class="logo" aria-label="visx-vue logo">
          <path d="M16 2L2 16l14 14 14-14L16 2zm0 4l10 10-10 10L6 16 16 6z" fill="currentColor" />
        </svg>
      </NuxtLink>
      <ul>
        <li>
          <NuxtLink to="/" class="nav-item" :class="{ active: route.path === '/' }">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/gallery" class="nav-item" :class="{ active: route.path === '/gallery' }"
            >Gallery</NuxtLink
          >
        </li>
      </ul>
      <a
        href="https://github.com/airbnb/visx"
        target="_blank"
        rel="noopener noreferrer"
        class="github-link"
        aria-label="GitHub"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </a>
    </div>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo {
  width: 28px;
  height: 28px;
  color: var(--color-accent);
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.1);
}

ul {
  display: flex;
  flex: 1;
  gap: 0.25rem;
}

.nav-item {
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.nav-item:hover {
  background: var(--color-border);
  color: var(--color-text);
}

.nav-item.active {
  color: var(--color-text);
  background: var(--color-border);
}

.github-link {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  transition: color 0.15s ease;
}

.github-link:hover {
  color: var(--color-text);
}

@media (max-width: 600px) {
  .nav-inner {
    width: 99vw;
    padding: 0 0.75rem;
  }
}
</style>
