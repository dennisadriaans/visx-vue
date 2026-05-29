import { ref } from 'vue'
import type { UseTooltipParams, ShowTooltipArgs, UpdateTooltipArgs } from './types'

export default function useTooltip<TooltipData = {}>(
  initialTooltipState?: Partial<{
    tooltipOpen: boolean
    tooltipLeft?: number
    tooltipTop?: number
    tooltipData?: TooltipData
  }>
): UseTooltipParams<TooltipData> {
  const tooltipOpen = ref(initialTooltipState?.tooltipOpen ?? false)
  const tooltipLeft = ref<number | undefined>(initialTooltipState?.tooltipLeft)
  const tooltipTop = ref<number | undefined>(initialTooltipState?.tooltipTop)
  const tooltipData = ref<TooltipData | undefined>(
    initialTooltipState?.tooltipData
  ) as UseTooltipParams<TooltipData>['tooltipData']

  function showTooltip(showArgs: ShowTooltipArgs<TooltipData>) {
    if (typeof showArgs === 'function') {
      const current = {
        tooltipLeft: tooltipLeft.value,
        tooltipTop: tooltipTop.value,
        tooltipData: tooltipData.value
      }
      const result = showArgs(
        current as Omit<
          {
            tooltipOpen: boolean
            tooltipLeft?: number
            tooltipTop?: number
            tooltipData?: TooltipData
          },
          'tooltipOpen'
        >
      )
      tooltipOpen.value = true
      tooltipLeft.value = result.tooltipLeft
      tooltipTop.value = result.tooltipTop
      tooltipData.value = result.tooltipData
    } else {
      tooltipOpen.value = true
      tooltipLeft.value = showArgs.tooltipLeft
      tooltipTop.value = showArgs.tooltipTop
      tooltipData.value = showArgs.tooltipData
    }
  }

  function hideTooltip() {
    tooltipOpen.value = false
    tooltipLeft.value = undefined
    tooltipTop.value = undefined
    tooltipData.value = undefined
  }

  function updateTooltip(args: UpdateTooltipArgs<TooltipData>) {
    if (typeof args === 'function') {
      const current = {
        tooltipOpen: tooltipOpen.value,
        tooltipLeft: tooltipLeft.value,
        tooltipTop: tooltipTop.value,
        tooltipData: tooltipData.value
      }
      const result = args(
        current as {
          tooltipOpen: boolean
          tooltipLeft?: number
          tooltipTop?: number
          tooltipData?: TooltipData
        }
      )
      tooltipOpen.value = result.tooltipOpen
      tooltipLeft.value = result.tooltipLeft
      tooltipTop.value = result.tooltipTop
      tooltipData.value = result.tooltipData
    } else {
      tooltipOpen.value = args.tooltipOpen
      tooltipLeft.value = args.tooltipLeft
      tooltipTop.value = args.tooltipTop
      tooltipData.value = args.tooltipData
    }
  }

  return {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    updateTooltip,
    showTooltip,
    hideTooltip
  }
}
