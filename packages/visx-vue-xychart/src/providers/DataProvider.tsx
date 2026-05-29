import { defineComponent, computed, provide, inject, type PropType } from 'vue'
import type { ScaleConfig } from '@visx-vue/scale'
import { scaleLinear, scaleOrdinal as createOrdinalScale } from '@visx-vue/scale'
import type { AxisScaleOutput } from '@visx-vue/axis'
import type { ResizeObserverPolyfill } from '@visx-vue/responsive'
import type { AxisScale, DataContextType, XYChartTheme } from '../types'
import { ThemeContextKey } from '../context/ThemeContext'
import { DataContextKey } from '../context/DataContext'
import useDataRegistry from '../hooks/useDataRegistry'
import type { Dimensions } from '../hooks/useDimensions'
import useDimensions from '../hooks/useDimensions'
import useScales from '../hooks/useScales'
import isDiscreteScale from '../utils/isDiscreteScale'
import lightTheme from '../theme/themes/light'

/** Props that can be passed to initialize/update the provider config. */
export type DataProviderProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  XScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  YScaleConfig extends ScaleConfig<AxisScaleOutput, any, any>
> = {
  /** Optionally define the initial dimensions. */
  initialDimensions?: Partial<Dimensions>
  /** Optional chart theme provided by DataProvider, overrides any theme already available in context. */
  theme?: XYChartTheme
  /** x-scale configuration whose shape depends on scale type. */
  xScale: XScaleConfig
  /** y-scale configuration whose shape depends on scale type. */
  yScale: YScaleConfig
  /** Determines whether Series will be plotted horizontally. By default this will try to be inferred based on scale types. */
  horizontal?: boolean | 'auto'
  /** Optionally set the resizeObserverPolyfill context. */
  resizeObserverPolyfill?: ResizeObserverPolyfill
}

const DataProvider = defineComponent({
  name: 'DataProvider',
  props: {
    initialDimensions: {
      type: Object as PropType<Partial<Dimensions>>,
      default: undefined
    },
    theme: {
      type: Object as PropType<XYChartTheme>,
      default: undefined
    },
    xScale: {
      type: Object as PropType<ScaleConfig<AxisScaleOutput>>,
      required: true as const
    },
    yScale: {
      type: Object as PropType<ScaleConfig<AxisScaleOutput>>,
      required: true as const
    },
    horizontal: {
      type: [Boolean, String] as PropType<boolean | 'auto'>,
      default: 'auto'
    },
    resizeObserverPolyfill: {
      type: Function as PropType<ResizeObserverPolyfill>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    // DataProvider provides a theme so that ThemeProvider is not strictly needed.
    // props.theme takes precedent over context.theme, which has a default even if
    // a ThemeProvider is not present.
    const contextTheme = inject(ThemeContextKey, lightTheme)
    const theme = computed(() => props.theme || contextTheme)

    const { width, height, margin, setDimensions } = useDimensions(props.initialDimensions)
    const innerWidth = computed(() =>
      Math.max(0, width.value - margin.value.left - margin.value.right)
    )
    const innerHeight = computed(() =>
      Math.max(0, height.value - margin.value.top - margin.value.bottom)
    )

    const dataRegistry = useDataRegistry<AxisScale, AxisScale, object>()

    const xRange = computed<[number, number]>(() => [
      margin.value.left,
      Math.max(0, width.value - margin.value.right)
    ])
    const yRange = computed<[number, number]>(() => [
      Math.max(0, height.value - margin.value.bottom),
      margin.value.top
    ])

    const { xScale, yScale } = useScales({
      dataRegistry,
      xScaleConfig: props.xScale,
      yScaleConfig: props.yScale,
      xRange,
      yRange
    })

    const registryKeys = computed(() => dataRegistry.keys())

    const colorScale = computed(() =>
      createOrdinalScale({
        domain: registryKeys.value,
        range: theme.value.colors
      })
    )

    const horizontal = computed(() =>
      props.horizontal === 'auto'
        ? isDiscreteScale(props.yScale) ||
          props.yScale.type === 'time' ||
          props.yScale.type === 'utc'
        : props.horizontal
    )

    const contextValue = computed<DataContextType<AxisScale, AxisScale, object>>(() => ({
      dataRegistry,
      registerData: dataRegistry.registerData,
      unregisterData: dataRegistry.unregisterData,
      xScale: xScale.value || scaleLinear(),
      yScale: yScale.value || scaleLinear(),
      colorScale: colorScale.value,
      theme: theme.value,
      width: width.value,
      height: height.value,
      margin: margin.value,
      innerWidth: innerWidth.value,
      innerHeight: innerHeight.value,
      setDimensions,
      horizontal: horizontal.value,
      resizeObserverPolyfill: props.resizeObserverPolyfill
    }))

    // Provide a Proxy that delegates property access to the current computed value.
    // This ensures inject() consumers get a plain-object-like interface (not a ComputedRef)
    // while preserving Vue reactivity tracking.
    const contextProxy = new Proxy({} as DataContextType<AxisScale, AxisScale, object>, {
      get(_, key) {
        return (contextValue.value as Record<string | symbol, unknown>)[key]
      },
      has(_, key) {
        return key in contextValue.value
      },
      ownKeys() {
        return Reflect.ownKeys(contextValue.value)
      },
      getOwnPropertyDescriptor(_, key) {
        return Object.getOwnPropertyDescriptor(contextValue.value, key)
      }
    })

    provide(DataContextKey, contextProxy as Partial<DataContextType<AxisScale, AxisScale, object>>)

    return () => slots.default?.()
  }
})

export default DataProvider
