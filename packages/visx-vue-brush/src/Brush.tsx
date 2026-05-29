import { defineComponent, ref, type PropType, type SVGAttributes, type VNode } from 'vue'
import type { BaseBrushProps, BaseBrushState } from './BaseBrush'
import BaseBrush from './BaseBrush'
import type { BrushHandleRenderProps } from './BrushHandle'
import type {
  Bounds,
  PartialBrushStartEnd,
  MarginShape,
  Point,
  ResizeTriggerAreas,
  Scale
} from './types'
import { scaleInvert, getDomainFromExtent } from './utils'

const SAFE_PIXEL = 2
const DEFAULT_COLOR = 'steelblue'

export type BrushProps = {
  /** Style object for the Brush selection rect. */
  selectedBoxStyle: SVGAttributes
  /** x-coordinate scale. */
  xScale: Scale
  /** y-coordinate scale. */
  yScale: Scale
  /** Brush stage height. */
  height: number
  /** Brush stage width. */
  width: number
  /** Callback invoked on a change in Brush bounds. */
  onChange?: (bounds: Bounds | null) => void
  /** Callback invoked on initialization of a Brush (not Brush move). */
  onBrushStart?: BaseBrushProps['onBrushStart']
  /** Callback invoked on mouse up when a Brush size is being updated. */
  onBrushEnd?: (bounds: Bounds | null) => void
  /** Callback invoked on mouse move in Brush stage when *not* dragging. */
  onMouseMove?: BaseBrushProps['onMouseMove']
  /** Callback invoked on mouse leave from Brush stage when *not* dragging. */
  onMouseLeave?: BaseBrushProps['onMouseLeave']
  /** Callback invoked on Brush stage click. */
  onClick?: BaseBrushProps['onClick']
  /** Margin subtracted from Brush stage dimensions. */
  margin?: MarginShape
  /** Allowed directions for Brush dimensional change. */
  brushDirection?: 'vertical' | 'horizontal' | 'both'
  /** Initial start and end position of the Brush. */
  initialBrushPosition?: PartialBrushStartEnd
  /** Array of rect sides and corners which should be resizeable / can trigger a Brush size change. */
  resizeTriggerAreas?: ResizeTriggerAreas[]
  /** What is being brushed, used for margin subtraction. */
  brushRegion?: 'xAxis' | 'yAxis' | 'chart'
  /** Orientation of yAxis if `brushRegion=yAxis`. */
  yAxisOrientation?: 'left' | 'right'
  /** Orientation of xAxis if `brushRegion=xAxis`. */
  xAxisOrientation?: 'top' | 'bottom'
  /** Whether movement of Brush should be disabled. */
  disableDraggingSelection: boolean
  /** Whether changing Brush size and position by clicking overlay should be disabled. */
  disableDraggingOverlay?: boolean
  /** Whether to reset the Brush on drag end. */
  resetOnEnd?: boolean
  /** Size of Brush handles, applies to all `resizeTriggerAreas`. */
  handleSize: number
  /** Prevent drag end on mouse leaving from brush stage. */
  useWindowMoveEvents?: boolean
  /** Render function for custom brush handles. */
  renderBrushHandle?: (props: BrushHandleRenderProps) => VNode
}

export const Brush = defineComponent({
  name: 'Brush',
  props: {
    selectedBoxStyle: {
      type: Object as PropType<SVGAttributes>,
      default: () => ({
        fill: DEFAULT_COLOR,
        'fill-opacity': 0.2,
        stroke: DEFAULT_COLOR,
        'stroke-width': 1,
        'stroke-opacity': 0.8
      })
    },
    xScale: { type: [Object, Function] as PropType<Scale>, default: undefined },
    yScale: { type: [Object, Function] as PropType<Scale>, default: undefined },
    height: { type: Number as PropType<number>, default: 0 },
    width: { type: Number as PropType<number>, default: 0 },
    onChange: {
      type: Function as PropType<(bounds: Bounds | null) => void>,
      default: undefined
    },
    onBrushStart: {
      type: Function as PropType<BaseBrushProps['onBrushStart']>,
      default: undefined
    },
    onBrushEnd: {
      type: Function as PropType<(bounds: Bounds | null) => void>,
      default: undefined
    },
    onMouseMove: {
      type: Function as PropType<BaseBrushProps['onMouseMove']>,
      default: undefined
    },
    onMouseLeave: {
      type: Function as PropType<BaseBrushProps['onMouseLeave']>,
      default: undefined
    },
    onClick: {
      type: Function as PropType<BaseBrushProps['onClick']>,
      default: undefined
    },
    margin: {
      type: Object as PropType<MarginShape>,
      default: () => ({ top: 0, left: 0, right: 0, bottom: 0 })
    },
    brushDirection: {
      type: String as PropType<'vertical' | 'horizontal' | 'both'>,
      default: 'horizontal'
    },
    initialBrushPosition: {
      type: Object as PropType<PartialBrushStartEnd>,
      default: undefined
    },
    resizeTriggerAreas: {
      type: Array as PropType<ResizeTriggerAreas[]>,
      default: () => ['left', 'right']
    },
    brushRegion: {
      type: String as PropType<'xAxis' | 'yAxis' | 'chart'>,
      default: 'chart'
    },
    yAxisOrientation: {
      type: String as PropType<'left' | 'right'>,
      default: 'right'
    },
    xAxisOrientation: {
      type: String as PropType<'top' | 'bottom'>,
      default: 'bottom'
    },
    disableDraggingSelection: { type: Boolean as PropType<boolean>, default: false },
    disableDraggingOverlay: { type: Boolean as PropType<boolean>, default: false },
    resetOnEnd: { type: Boolean as PropType<boolean>, default: false },
    handleSize: { type: Number as PropType<number>, default: 4 },
    useWindowMoveEvents: { type: Boolean as PropType<boolean>, default: false },
    renderBrushHandle: {
      type: Function as PropType<(props: BrushHandleRenderProps) => VNode>,
      default: undefined
    }
  },
  setup(props, { expose }) {
    const baseBrushRef = ref<InstanceType<typeof BaseBrush> | null>(null)

    function convertRangeToDomain(brush: BaseBrushState) {
      const { x0, x1, y0, y1 } = brush.extent

      const xDomain = getDomainFromExtent(props.xScale!, x0 || 0, x1 || 0, SAFE_PIXEL)
      const yDomain = getDomainFromExtent(props.yScale!, y0 || 0, y1 || 0, SAFE_PIXEL)

      const domain: Bounds = {
        x0: xDomain.start || 0,
        x1: xDomain.end || 0,
        xValues: xDomain.values,
        y0: yDomain.start || 0,
        y1: yDomain.end || 0,
        yValues: yDomain.values
      }

      return domain
    }

    function handleChange(brush: BaseBrushState) {
      if (!props.onChange) return
      const { x0 } = brush.extent
      if (typeof x0 === 'undefined' || x0 < 0) {
        props.onChange(null)
        return
      }
      const domain = convertRangeToDomain(brush)
      props.onChange(domain)
    }

    function handleBrushStart(point: Point) {
      if (!props.onBrushStart) return
      const { x, y } = point
      const xScale = props.xScale!
      const yScale = props.yScale!
      const invertedX = scaleInvert(xScale, x)
      const invertedY = scaleInvert(yScale, y)
      props.onBrushStart({
        x:
          'invert' in xScale && typeof xScale.invert !== 'undefined'
            ? invertedX
            : xScale.domain()[invertedX],
        y:
          'invert' in yScale && typeof yScale.invert !== 'undefined'
            ? invertedY
            : yScale.domain()[invertedY]
      })
    }

    function handleBrushEnd(brush: BaseBrushState) {
      if (!props.onBrushEnd) return
      const { x0 } = brush.extent
      if (typeof x0 === 'undefined' || x0 < 0) {
        props.onBrushEnd(null)
        return
      }
      const domain = convertRangeToDomain(brush)
      props.onBrushEnd(domain)
    }

    // Expose programmatic control methods
    expose({
      updateBrush: (...args: unknown[]) => {
        const instance = baseBrushRef.value as any
        return instance?.updateBrush?.(...args)
      },
      reset: () => {
        const instance = baseBrushRef.value as any
        return instance?.reset?.()
      }
    })

    return () => {
      if (!props.xScale || !props.yScale) return null

      let brushRegionWidth: number
      let brushRegionHeight: number
      let left: number
      let top: number
      const marginLeft = props.margin?.left ? props.margin.left : 0
      const marginTop = props.margin?.top ? props.margin.top : 0
      const marginRight = props.margin?.right ? props.margin.right : 0
      const marginBottom = props.margin?.bottom ? props.margin.bottom : 0

      if (props.brushRegion === 'chart') {
        left = 0
        top = 0
        brushRegionWidth = props.width
        brushRegionHeight = props.height
      } else if (props.brushRegion === 'yAxis') {
        top = 0
        brushRegionHeight = props.height
        if (props.yAxisOrientation === 'right') {
          left = props.width
          brushRegionWidth = marginRight
        } else {
          left = -marginLeft
          brushRegionWidth = marginLeft
        }
      } else {
        left = 0
        brushRegionWidth = props.width
        if (props.xAxisOrientation === 'bottom') {
          top = props.height
          brushRegionHeight = marginBottom
        } else {
          top = -marginTop
          brushRegionHeight = marginTop
        }
      }

      return (
        <BaseBrush
          ref={baseBrushRef}
          width={brushRegionWidth}
          height={brushRegionHeight}
          left={left}
          top={top}
          brushDirection={props.brushDirection}
          disableDraggingSelection={props.disableDraggingSelection}
          disableDraggingOverlay={props.disableDraggingOverlay}
          handleSize={props.handleSize}
          inheritedMargin={props.margin}
          initialBrushPosition={props.initialBrushPosition}
          resetOnEnd={props.resetOnEnd}
          resizeTriggerAreas={props.resizeTriggerAreas}
          selectedBoxStyle={props.selectedBoxStyle}
          onBrushEnd={handleBrushEnd}
          onBrushStart={handleBrushStart}
          onChange={handleChange}
          onClick={props.onClick}
          onMouseLeave={props.onMouseLeave}
          onMouseMove={props.onMouseMove}
          useWindowMoveEvents={props.useWindowMoveEvents}
          renderBrushHandle={props.renderBrushHandle}
        />
      )
    }
  }
})

export default Brush
