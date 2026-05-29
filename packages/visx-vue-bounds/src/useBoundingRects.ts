import { ref, onMounted, type Ref, type ShallowRef } from 'vue'
import type { RectShape } from './types'

const emptyRect: RectShape = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  width: 0,
  height: 0
}

function toRectShape(domRect: DOMRect): RectShape {
  return {
    top: domRect.top,
    right: domRect.right,
    bottom: domRect.bottom,
    left: domRect.left,
    width: domRect.width,
    height: domRect.height
  }
}

/**
 * Vue composable that measures the bounding rect of an element and its parent.
 * Replaces the React `withBoundingRects` HOC.
 *
 * @param nodeRef - A template ref pointing to the target DOM element.
 * @returns Reactive `rect`, `parentRect`, and an `update` function to re-measure.
 */
export function useBoundingRects(
  nodeRef: Ref<HTMLElement | SVGElement | null> | ShallowRef<HTMLElement | SVGElement | null>
) {
  const rect = ref<RectShape | undefined>(undefined)
  const parentRect = ref<RectShape | undefined>(undefined)

  function update() {
    const node = nodeRef.value
    if (!node) {
      rect.value = undefined
      parentRect.value = undefined
      return
    }

    rect.value = node.getBoundingClientRect ? toRectShape(node.getBoundingClientRect()) : emptyRect

    const parentNode = node.parentElement
    parentRect.value = parentNode?.getBoundingClientRect
      ? toRectShape(parentNode.getBoundingClientRect())
      : emptyRect
  }

  onMounted(update)

  return {
    rect,
    parentRect,
    update
  }
}
