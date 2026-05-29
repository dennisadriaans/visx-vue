import {
  defineComponent,
  inject,
  ref,
  watch,
  type CSSProperties,
  type PropType,
  type VNode
} from 'vue'
import { useTooltipInPortal, defaultStyles } from '@visx-vue/tooltip'
import type { TooltipProps as BaseTooltipProps, UseTooltipPortalOptions } from '@visx-vue/tooltip'
import type { PickD3Scale } from '@visx-vue/scale'

import { TooltipContextKey } from '../context/TooltipContext'
import { DataContextKey } from '../context/DataContext'
import type { InferDataContext } from '../context/DataContext'
import getScaleBandwidth from '../utils/getScaleBandwidth'
import isValidNumber from '../typeguards/isValidNumber'
import type { GlyphProps, TooltipContextType } from '../types'

/** fontSize + lineHeight from default styles break precise location of crosshair, etc. */
const TOOLTIP_NO_STYLE: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  fontSize: 0,
  lineHeight: 0
}

export type RenderTooltipParams<Datum extends object> = TooltipContextType<Datum> & {
  colorScale?: PickD3Scale<'ordinal', string, string>
}

export interface RenderTooltipGlyphProps<Datum extends object> extends Omit<
  GlyphProps<Datum>,
  'onBlur' | 'onFocus' | 'onPointerMove' | 'onPointerOut' | 'onPointerUp'
> {
  glyphStyle?: Record<string, string | number | undefined>
  isNearestDatum: boolean
}

export type TooltipProps<Datum extends object> = {
  /**
   * When TooltipContext.tooltipOpen=true, this function is invoked and if the
   * return value is non-null, its content is rendered inside the tooltip container.
   * Content will be rendered in an HTML parent.
   */
  renderTooltip: (params: RenderTooltipParams<Datum>) => VNode | null
  /** Function which handles rendering glyphs. */
  renderGlyph?: (params: RenderTooltipGlyphProps<Datum>) => VNode | null
  /** Whether to snap tooltip + crosshair x-coord to the nearest Datum x-coord instead of the event x-coord. */
  snapTooltipToDatumX?: boolean
  /** Whether to snap tooltip + crosshair y-coord to the nearest Datum y-coord instead of the event y-coord. */
  snapTooltipToDatumY?: boolean
  /** Whether to show a vertical line at tooltip position. */
  showVerticalCrosshair?: boolean
  /** Whether to show a horizontal line at tooltip position. */
  showHorizontalCrosshair?: boolean
  /** Whether to show a glyph at the tooltip position for the (single) nearest Datum. */
  showDatumGlyph?: boolean
  /** Whether to show a glyph for the nearest Datum in each series. */
  showSeriesGlyphs?: boolean
  /** Optional styles for the vertical crosshair, if visible. */
  verticalCrosshairStyle?: Record<string, string | number | undefined>
  /** Optional styles for the vertical crosshair, if visible. */
  horizontalCrosshairStyle?: Record<string, string | number | undefined>
  /** Optional styles for the point, if visible. */
  glyphStyle?: Record<string, string | number | undefined>
} & Omit<BaseTooltipProps, 'left' | 'top' | 'children'> &
  Pick<UseTooltipPortalOptions, 'detectBounds' | 'zIndex'>

const INVISIBLE_STYLES: CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  opacity: 0,
  width: 0,
  height: 0,
  pointerEvents: 'none'
}

const DefaultGlyph = defineComponent({
  name: 'DefaultGlyph',
  props: {
    x: { type: Number as PropType<number>, default: 0 },
    y: { type: Number as PropType<number>, default: 0 },
    size: { type: Number as PropType<number>, default: 4 },
    color: { type: String as PropType<string>, default: '#222' },
    glyphStyle: {
      type: Object as PropType<Record<string, string | number | undefined>>,
      default: undefined
    }
  },
  setup(props) {
    const dataCtx = inject(DataContextKey, {} as Partial<InferDataContext>)
    return () => {
      const theme = (dataCtx as InferDataContext)?.theme
      return (
        <circle
          cx={props.x}
          cy={props.y}
          r={props.size}
          fill={props.color}
          stroke={theme?.backgroundColor}
          stroke-width={1.5}
          paint-order="fill"
          {...props.glyphStyle}
        />
      )
    }
  }
})

function defaultRenderGlyph<Datum extends object>(props: RenderTooltipGlyphProps<Datum>) {
  return (
    <DefaultGlyph
      x={props.x}
      y={props.y}
      size={props.size}
      color={props.color}
      glyphStyle={props.glyphStyle}
    />
  )
}

const TooltipInner = defineComponent({
  name: 'TooltipInner',
  inheritAttrs: false,
  props: {
    detectBounds: { type: Boolean as PropType<boolean>, default: undefined },
    horizontalCrosshairStyle: {
      type: Object as PropType<Record<string, string | number | undefined>>,
      default: undefined
    },
    glyphStyle: {
      type: Object as PropType<Record<string, string | number | undefined>>,
      default: undefined
    },
    renderTooltip: {
      type: Function as PropType<(params: RenderTooltipParams<object>) => VNode | null>,
      required: true
    },
    renderGlyph: {
      type: Function as PropType<(params: RenderTooltipGlyphProps<object>) => VNode | null>,
      default: undefined
    },
    showDatumGlyph: { type: Boolean as PropType<boolean>, default: false },
    showHorizontalCrosshair: { type: Boolean as PropType<boolean>, default: false },
    showSeriesGlyphs: { type: Boolean as PropType<boolean>, default: false },
    showVerticalCrosshair: { type: Boolean as PropType<boolean>, default: false },
    snapTooltipToDatumX: { type: Boolean as PropType<boolean>, default: false },
    snapTooltipToDatumY: { type: Boolean as PropType<boolean>, default: false },
    verticalCrosshairStyle: {
      type: Object as PropType<Record<string, string | number | undefined>>,
      default: undefined
    },
    zIndex: { type: [Number, String] as PropType<number | string>, default: undefined },
    // BaseTooltipProps pass-throughs
    className: { type: String as PropType<string>, default: undefined },
    offsetLeft: { type: Number as PropType<number>, default: undefined },
    offsetTop: { type: Number as PropType<number>, default: undefined },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
    unstyled: { type: Boolean as PropType<boolean>, default: undefined },
    applyPositionStyle: { type: Boolean as PropType<boolean>, default: undefined }
  },
  setup(props) {
    const dataCtx = inject(DataContextKey, {} as Partial<InferDataContext>)
    const tooltipContext = inject(TooltipContextKey, null) as TooltipContextType<object> | null

    const { containerRef, forceRefreshBounds, TooltipInPortal } = useTooltipInPortal({
      detectBounds: props.detectBounds,
      zIndex: props.zIndex
    })

    // To correctly position itself in a Portal, the tooltip must know its container bounds.
    // This is done by rendering an invisible node whose ref can be used to find its parentElement.
    const invisibleRef = ref<SVGSVGElement | null>(null)

    watch(invisibleRef, (el) => {
      containerRef.value = el?.parentElement ?? null
    })

    const glyphRenderer = props.renderGlyph ?? defaultRenderGlyph

    // Force refresh bounds when tooltip transitions from hidden to visible
    const lastShowTooltip = ref(false)

    return () => {
      if (!tooltipContext) return null

      const { colorScale, theme, innerHeight, innerWidth, margin, xScale, yScale, dataRegistry } =
        dataCtx as InferDataContext

      const tooltipOpen = tooltipContext.tooltipOpen.value
      const tooltipData = tooltipContext.tooltipData.value

      const tooltipContent = tooltipOpen
        ? props.renderTooltip({ ...tooltipContext, colorScale })
        : null

      const showTooltip = tooltipOpen && tooltipContent != null

      // Force refresh bounds when transitioning from hidden to visible
      if (showTooltip && !lastShowTooltip.value) {
        forceRefreshBounds()
      }
      lastShowTooltip.value = showTooltip

      let tooltipLeft = tooltipContext.tooltipLeft.value
      let tooltipTop = tooltipContext.tooltipTop.value

      const xScaleBandwidth = xScale ? getScaleBandwidth(xScale) : 0
      const yScaleBandwidth = yScale ? getScaleBandwidth(yScale) : 0

      function getDatumLeftTop(key: string, datum: object) {
        const entry = dataRegistry?.get(key)
        const xAccessor = entry?.xAccessor
        const yAccessor = entry?.yAccessor
        const left =
          xScale && xAccessor ? Number(xScale(xAccessor(datum))) + xScaleBandwidth / 2 : undefined
        const top =
          yScale && yAccessor ? Number(yScale(yAccessor(datum))) + yScaleBandwidth / 2 : undefined
        return { left, top }
      }

      const nearestDatum = tooltipData?.nearestDatum
      const nearestDatumKey = nearestDatum?.key ?? ''

      // snap x- or y-coord to the actual data point (not event coordinates)
      if (showTooltip && nearestDatum && (props.snapTooltipToDatumX || props.snapTooltipToDatumY)) {
        const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum)
        tooltipLeft = props.snapTooltipToDatumX && isValidNumber(left) ? left : tooltipLeft
        tooltipTop = props.snapTooltipToDatumY && isValidNumber(top) ? top : tooltipTop
      }

      // collect positions + styles for glyphs; glyphs always snap to Datum, not event coords
      const glyphPropsList: RenderTooltipGlyphProps<object>[] = []

      if (showTooltip && (props.showDatumGlyph || props.showSeriesGlyphs)) {
        const size = Number((props.glyphStyle as Record<string, unknown>)?.radius ?? 4)

        if (props.showSeriesGlyphs) {
          Object.values(tooltipData?.datumByKey ?? {}).forEach(({ key, datum, index }) => {
            const color = colorScale?.(key) ?? theme?.htmlLabel?.color ?? '#222'
            const { left, top } = getDatumLeftTop(key, datum)

            // don't show glyphs if coords are unavailable
            if (!isValidNumber(left) || !isValidNumber(top)) return

            glyphPropsList.push({
              key,
              color,
              datum,
              index,
              size,
              x: left,
              y: top,
              glyphStyle: props.glyphStyle,
              isNearestDatum: nearestDatum ? nearestDatum.key === key : false
            })
          })
        } else if (nearestDatum) {
          const { left, top } = getDatumLeftTop(nearestDatumKey, nearestDatum.datum)
          // don't show glyphs if coords are unavailable
          if (isValidNumber(left) && isValidNumber(top)) {
            const color =
              (nearestDatumKey && colorScale?.(nearestDatumKey)) ??
              // @ts-expect-error intentional fallback
              null ??
              theme?.gridStyles?.stroke ??
              theme?.htmlLabel?.color ??
              '#222'
            glyphPropsList.push({
              key: nearestDatumKey,
              color,
              datum: nearestDatum.datum,
              index: nearestDatum.index,
              size,
              x: left,
              y: top,
              glyphStyle: props.glyphStyle,
              isNearestDatum: true
            })
          }
        }
      }

      return (
        <>
          <svg
            ref={invisibleRef}
            style={INVISIBLE_STYLES}
          />
          {showTooltip && (
            <>
              {props.showVerticalCrosshair && (
                <TooltipInPortal
                  class="visx-crosshair visx-crosshair-vertical"
                  left={tooltipLeft}
                  top={margin?.top}
                  offsetLeft={0}
                  offsetTop={0}
                  detectBounds={false}
                  style={TOOLTIP_NO_STYLE}
                >
                  <svg
                    width="1"
                    height={innerHeight}
                    overflow="visible"
                  >
                    <line
                      x1={0}
                      x2={0}
                      y1={0}
                      y2={innerHeight}
                      stroke-width={1.5}
                      stroke={theme?.gridStyles?.stroke ?? theme?.htmlLabel?.color ?? '#222'}
                      {...props.verticalCrosshairStyle}
                    />
                  </svg>
                </TooltipInPortal>
              )}
              {props.showHorizontalCrosshair && (
                <TooltipInPortal
                  class="visx-crosshair visx-crosshair-horizontal"
                  left={margin?.left}
                  top={tooltipTop}
                  offsetLeft={0}
                  offsetTop={0}
                  detectBounds={false}
                  style={TOOLTIP_NO_STYLE}
                >
                  <svg
                    width={innerWidth}
                    height="1"
                    overflow="visible"
                  >
                    <line
                      x1={0}
                      x2={innerWidth}
                      y1={0}
                      y2={0}
                      stroke-width={1.5}
                      stroke={theme?.gridStyles?.stroke ?? theme?.htmlLabel?.color ?? '#222'}
                      {...props.horizontalCrosshairStyle}
                    />
                  </svg>
                </TooltipInPortal>
              )}
              {glyphPropsList.map(({ key, x, y, ...rest }) => (
                <TooltipInPortal
                  key={key}
                  class="visx-tooltip-glyph"
                  left={x}
                  top={y}
                  offsetLeft={0}
                  offsetTop={0}
                  detectBounds={false}
                  style={TOOLTIP_NO_STYLE}
                >
                  <svg overflow="visible">{glyphRenderer({ key, x: 0, y: 0, ...rest })}</svg>
                </TooltipInPortal>
              ))}
              <TooltipInPortal
                left={tooltipLeft}
                top={tooltipTop}
                style={{
                  ...defaultStyles,
                  background: theme?.backgroundColor ?? 'white',
                  boxShadow: `0 1px 2px ${
                    theme?.htmlLabel?.color ? `${theme.htmlLabel.color}55` : '#22222255'
                  }`,
                  ...theme?.htmlLabel
                }}
                className={props.className}
                offsetLeft={props.offsetLeft}
                offsetTop={props.offsetTop}
                unstyled={props.unstyled}
                applyPositionStyle={props.applyPositionStyle}
              >
                {tooltipContent}
              </TooltipInPortal>
            </>
          )}
        </>
      )
    }
  }
})

/**
 * This is a wrapper component which bails early if tooltip is not visible.
 * If scroll detection is enabled in UseTooltipPortalOptions, this avoids re-rendering
 * the component on every scroll. If many charts with Tooltips are rendered on a page,
 * this also avoids creating many resize observers / hitting browser limits.
 */
const Tooltip = defineComponent({
  name: 'Tooltip',
  inheritAttrs: false,
  props: {
    ...TooltipInner.props
  },
  setup(props) {
    const tooltipContext = inject(TooltipContextKey, null) as TooltipContextType<object> | null

    return () => {
      if (!tooltipContext?.tooltipOpen.value) return null
      // props includes renderTooltip from TooltipInner.props spread
      return <TooltipInner {...(props as InstanceType<typeof TooltipInner>['$props'])} />
    }
  }
})

export default Tooltip
