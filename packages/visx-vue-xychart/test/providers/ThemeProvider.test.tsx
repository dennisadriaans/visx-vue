// @vitest-environment jsdom
import { describe, it, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ThemeProvider from '../../src/providers/ThemeProvider'
import { useThemeContext } from '../../src/context/ThemeContext'

describe('<ThemeProvider />', () => {
  it('should be defined', () => {
    expect(ThemeProvider).toBeDefined()
  })

  it('should provide a XYChartTheme', () => {
    expect.assertions(1)

    const ThemeConsumer = defineComponent({
      setup() {
        const theme = useThemeContext()
        expect(theme).toBeDefined()
        return () => null
      }
    })

    mount(ThemeProvider, {
      slots: {
        default: () => <ThemeConsumer />
      }
    })
  })
})
