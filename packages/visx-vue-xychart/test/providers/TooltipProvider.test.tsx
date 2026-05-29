// @vitest-environment jsdom
import { describe, it, expect } from 'vite-plus/test'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, onMounted, nextTick, watchEffect } from 'vue'
import TooltipProvider from '../../src/providers/TooltipProvider'
import { useTooltipContext } from '../../src/context/TooltipContext'
import type { TooltipData } from '../../src/types'

describe('<TooltipProvider />', () => {
  it('should be defined', () => {
    expect(TooltipProvider).toBeDefined()
  })

  it('should provide tooltip state', () => {
    expect.assertions(1)

    const TooltipConsumer = defineComponent({
      setup() {
        const tooltipContext = useTooltipContext()
        expect(tooltipContext).toMatchObject({
          tooltipOpen: expect.anything(), // ref
          showTooltip: expect.any(Function),
          updateTooltip: expect.any(Function),
          hideTooltip: expect.any(Function)
        })
        return () => null
      }
    })

    mount(TooltipProvider, {
      slots: {
        default: () => <TooltipConsumer />
      }
    })
  })

  it('showTooltip should update tooltipData.nearestDatum/datumByKey', async () => {
    expect.assertions(1)
    let assertions = 0

    const TooltipConsumer = defineComponent({
      setup() {
        const tooltipContext = useTooltipContext()

        onMounted(() => {
          if (tooltipContext && !tooltipContext.tooltipOpen.value) {
            tooltipContext.showTooltip({
              key: 'near',
              index: 0,
              distanceX: 0,
              distanceY: 0,
              datum: { hi: 'hello' }
            })
            tooltipContext.showTooltip({
              key: 'far',
              index: 1,
              datum: { good: 'bye' },
              distanceX: NaN
              // no distance = Infinity
            })
          }
        })

        watchEffect(() => {
          if (tooltipContext?.tooltipOpen.value && assertions === 0) {
            assertions++
            expect(tooltipContext.tooltipData.value).toMatchObject({
              nearestDatum: { key: 'near', index: 0, distance: 0, datum: { hi: 'hello' } },
              datumByKey: {
                near: { key: 'near', index: 0, datum: { hi: 'hello' } },
                far: { key: 'far', index: 1, datum: { good: 'bye' } }
              }
            } as TooltipData<object>)
          }
        })

        return () => null
      }
    })

    mount(TooltipProvider, {
      slots: {
        default: () => <TooltipConsumer />
      }
    })

    await flushPromises()
    await nextTick()
  })
})
