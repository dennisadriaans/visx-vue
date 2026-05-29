import { defineComponent, type PropType, type VNode } from 'vue'
import type { AxisScale } from '@visx-vue/axis'
import type { ScaleInput } from '@visx-vue/scale'
import type { GlyphProps, GlyphsProps, SeriesProps } from '../../types'
import BaseGlyphSeries from './private/BaseGlyphSeries'
import type { BaseGlyphSeriesProps } from './private/BaseGlyphSeries'
import defaultRenderGlyph from './private/defaultRenderGlyph'

export type GlyphSeriesProps<
  XScale extends AxisScale,
  YScale extends AxisScale,
  Datum extends object
> = Omit<BaseGlyphSeriesProps<XScale, YScale, Datum>, 'renderGlyphs'> & {
  renderGlyph?: (props: GlyphProps<Datum>) => VNode
}

export default defineComponent({
  name: 'GlyphSeries',
  props: {
    dataKey: { type: String as PropType<string>, required: true },
    data: { type: Array as PropType<object[]>, required: true },
    xAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    yAccessor: { type: Function as PropType<(d: object) => ScaleInput<AxisScale>>, required: true },
    colorAccessor: {
      type: Function as PropType<(d: object, index: number) => string | null | undefined>,
      default: undefined
    },
    size: { type: [Number, Function] as PropType<number | ((d: object) => number)>, default: 8 },
    renderGlyph: {
      type: Function as PropType<(props: GlyphProps<object>) => VNode>,
      default: undefined
    },
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
    const renderGlyph = props.renderGlyph ?? defaultRenderGlyph

    function renderGlyphs({
      glyphs,
      onPointerMove,
      onPointerOut,
      onPointerUp,
      onFocus,
      onBlur
    }: GlyphsProps<AxisScale, AxisScale, object>) {
      return (
        <>
          {glyphs.map((glyph) =>
            renderGlyph({
              ...glyph,
              onPointerMove,
              onPointerOut,
              onPointerUp,
              onFocus,
              onBlur
            })
          )}
        </>
      )
    }

    return () => (
      <BaseGlyphSeries
        dataKey={props.dataKey}
        data={props.data}
        xAccessor={props.xAccessor}
        yAccessor={props.yAccessor}
        colorAccessor={props.colorAccessor}
        size={props.size}
        enableEvents={props.enableEvents}
        onPointerMove={props.onPointerMove}
        onPointerOut={props.onPointerOut}
        onPointerUp={props.onPointerUp}
        onPointerDown={props.onPointerDown}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        renderGlyphs={renderGlyphs}
      />
    )
  }
})
