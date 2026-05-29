import type { CSSProperties } from 'vue'
import { Bar } from '@visx-vue/shape'

export type BrushOverlayProps = {
  width: number
  height: number
  style?: CSSProperties
  onClick?: (event: PointerEvent) => void
  onDoubleClick?: (event: MouseEvent) => void
  onPointerDown?: (event: PointerEvent) => void
  onPointerLeave?: (event: PointerEvent) => void
  onPointerMove?: (event: PointerEvent) => void
  onPointerUp?: (event: PointerEvent) => void
}

export default function BrushOverlay(props: BrushOverlayProps) {
  return (
    <Bar
      class="visx-brush-overlay"
      fill="transparent"
      x={0}
      y={0}
      width={props.width}
      height={props.height}
      style={props.style}
      onClick={props.onClick}
      onDblclick={props.onDoubleClick}
      onPointerdown={props.onPointerDown}
      onPointerleave={props.onPointerLeave}
      onPointermove={props.onPointerMove}
      onPointerup={props.onPointerUp}
    />
  )
}
