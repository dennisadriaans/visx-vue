export default defineAppConfig({
  github: {
    url: 'https://github.com/dennisadriaans/visx-vue'
  },
  header: {
    title: 'visx-vue'
  },
  docus: {
    title: 'visx-vue',
    description: 'Visualization primitives for Vue, ported from visx.',
    image: '/og-image.png',
    socials: {
      github: 'https://github.com/dennisadriaans/visx-vue'
    },
    github: {
      dir: 'visx-vue/packages',
      branch: 'main',
      repo: 'visx-vue',
      owner: 'dennisofficial',
      edit: true
    },
    header: {
      logo: true,
      showLinkIcon: true
    },
    navigation: {
      sub: 'aside'
    },
    footer: {
      credits: {
        icon: 'IconDocus',
        text: 'Powered by Docus',
        href: 'https://docus.dev'
      }
    }
  },
  ui: {
    page: {
      slots: {
        left: 'top-0'
      }
    }
  }
})
