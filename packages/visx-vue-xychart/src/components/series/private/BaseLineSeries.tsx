import { defineComponent, computed, inject, watchEffect, type Component, type PropType } from 'vue'
import { LinePath } from '@visx-vue/shape'
import type { CurveFactory, CurveFactoryLineOnly } from '@visx-vue/vendor/d3-shape'
import type { AxisScale } from '@visx-vue/axis'
import type { ScaleInput } from '@visx-vue/scale'
import { DataContextKey } from '../../../context/DataContext'
import type { DataContextType, GlyphsProps, SeriesProps } from '../../../types'
import getScaledValueFactory from '../../../utils/getScaledValueFactory'
import isValidNumber from '../../../typeguards/isValidNumber'
import { LINESERIES_EVENT_SOURCE, XYCHART_EVENT_SOURCE } from '../../../constants'
import { BaseGlyphSeries } from './BaseGlyphSeries'
import defaultRenderGlyph from './defaultRenderGlyph'
import useSeriesEvents from '../../../hooks/useSeriesEvents'

export type BaseLineSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = SeriesProps<XScale, YScale, Datum> & {
  /** Rendered component which is passed path props by BaseLineSeries after processing. */
  PathComponent?: Component | 'path'
  /** Sets the curve factory for the line generator. Defaults to curveLinear. */
  curve?: CurveFactory | CurveFactoryLineOnly
  /** Given a datakey, returns its color. Falls back to theme color if unspecified or if a null-ish value is returned. */
  colorAccessor?: (dataKey: string) => string | undefined | null
}

export default defineComponent({
  name: 'BaseLineSeries',
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    colorAccessor: {
      type: Function as PropType<(dataKey: string) => string | undefined | null>,
      default: undefined
    },
    curve: { type: Function as PropType<CurveFactory | CurveFactoryLineOnly>, default: undefined },
    PathComponent: { type: [Object, String] as PropType<Component | 'path'>, default: 'path' },
    enableEvents: { type: Boolean as PropType<boolean>, default: true },
    onPointerMove: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>['onPointerMove']>,
      default: undefined
    },
    onPointerOut: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>['onPointerOut']>,
      default: undefined
    },
    onPointerUp: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>['onPointerUp']>,
      default: undefined
    },
    onPointerDown: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>['onPointerDown']>,
      default: undefined
    },
    onFocus: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>['onFocus']>,
      default: undefined
    },
    onBlur: {
      type: Function as PropType<SeriesProps<AxisScale, AxisScale, object>['onBlur']>,
      default: undefined
    }
  },
  setup(props) {
    const dataContext = inject(DataContextKey, {}) as Partial<
      DataContextType<AxisScale, AxisScale, object>
    >

    // Register data
    watchEffect((onCleanup) => {
      if (dataContext.dataRegistry) {
        dataContext.dataRegistry.registerData({
          key: props.dataKey,
          data: props.data,
          xAccessor: props.xAccessor,
          yAccessor: props.yAccessor
        })
        onCleanup(() => {
          dataContext.dataRegistry?.unregisterData(props.dataKey)
        })
      }
    })

    const ownEventSourceKey = computed(() => `${LINESERIES_EVENT_SOURCE}-${props.dataKey}`)

    const eventEmitters = useSeriesEvents({
      dataKey: props.dataKey,
      enableEvents: props.enableEvents,
      onBlur: props.onBlur,
      onFocus: props.onFocus,
      onPointerMove: props.onPointerMove,
      onPointerOut: props.onPointerOut,
      onPointerUp: props.onPointerUp,
      onPointerDown: props.onPointerDown,
      source: ownEventSourceKey.value,
      allowedSources: [XYCHART_EVENT_SOURCE, ownEventSourceKey.value]
    })

    return () => {
      const { xScale, yScale, colorScale, theme } = dataContext
      const registryEntry = dataContext.dataRegistry?.get(props.dataKey)

      if (!xScale || !yScale || !registryEntry) return null

      const data = registryEntry.data
      const xAccessor = registryEntry.xAccessor
      const yAccessor = registryEntry.yAccessor

      const getScaledX = getScaledValueFactory(xScale, xAccessor)
      const getScaledY = getScaledValueFactory(yScale, yAccessor)
      const isDefined = (d: object) =>
        isValidNumber(xScale(xAccessor(d))) && isValidNumber(yScale(yAccessor(d)))
      const color = colorScale?.(props.dataKey) ?? theme?.colors?.[0] ?? '#222'

      const PathTag = props.PathComponent as any
      const captureFocusEvents = Boolean(props.onFocus || props.onBlur)

      const renderGlyphs = ({ glyphs }: GlyphsProps<AxisScale, AxisScale, object>) =>
        captureFocusEvents
          ? glyphs.map((glyph) =>
              defaultRenderGlyph({
                ...glyph,
                color: 'transparent',
                onFocus: eventEmitters.onFocus,
                onBlur: eventEmitters.onBlur
              })
            )
          : null

      return (
        <>
          <LinePath
            x={getScaledX as any}
            y={getScaledY as any}
            defined={isDefined as any}
            curve={props.curve}
          >
            {{
              default: ({ path }: { path: (data: object[]) => string | null }) => (
                <PathTag
                  class="visx-line"
                  stroke={props.colorAccessor?.(props.dataKey) ?? color}
                  stroke-width={2}
                  fill="transparent"
                  stroke-linecap="round"
                  d={path(data) || ''}
                  {...eventEmitters}
                />
              )
            }}
          </LinePath>
          {captureFocusEvents && (
            <BaseGlyphSeries
              dataKey={props.dataKey}
              data={data}
              xAccessor={xAccessor}
              yAccessor={yAccessor}
              renderGlyphs={renderGlyphs}
            />
          )}
        </>
      )
    }
  }
})
