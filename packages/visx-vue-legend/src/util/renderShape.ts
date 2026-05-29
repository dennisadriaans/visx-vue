import { h, isVNode, cloneVNode, type Component, type VNode } from 'vue'
import RectShape from '../shapes/Rect'
import CircleShape from '../shapes/Circle'
import LineShape from '../shapes/Line'

import type {
  LegendShape,
  FormattedLabel,
  FillAccessor,
  SizeAccessor,
  ShapeStyleAccessor,
  RenderShapeProvidedProps
} from '../types'

type RenderShapeArgs<Data, Output> = {
  shape?: LegendShape<Data, Output>
  label: FormattedLabel<Data, Output>
  item: Data
  itemIndex: number
  fill?: FillAccessor<Data, Output>
  size?: SizeAccessor<Data, Output>
  shapeStyle?: ShapeStyleAccessor<Data, Output>
  width?: string | number
  height?: string | number
}

const NO_OP = () => undefined

export default function renderShape<Data, Output>({
  shape = 'rect',
  fill = NO_OP,
  size = NO_OP,
  width,
  height,
  label,
  item,
  itemIndex,
  shapeStyle = NO_OP
}: RenderShapeArgs<Data, Output>): VNode | null {
  const props: RenderShapeProvidedProps<Data, Output> = {
    width,
    height,
    item,
    itemIndex,
    label,
    fill: fill({ ...label }),
    size: size({ ...label }),
    style: shapeStyle({ ...label })
  }

  if (typeof shape === 'string') {
    if (shape === 'circle') return h(CircleShape, props)
    if (shape === 'line') return h(LineShape, props)
    return h(RectShape, props)
  }
  if (isVNode(shape)) {
    return cloneVNode(shape, props)
  }
  if (shape) {
    return h(shape as Component, props)
  }
  return null
}
