import { type ComputedRef, computed } from 'vue'
import reduceCSSCalc from 'reduce-css-calc'
import type { TextProps, WordsWithWidth } from '../types'
import getStringWidth from '../util/getStringWidth'

function isNumber(val: unknown): val is number {
  return typeof val === 'number'
}

function isXOrYInValid(xOrY: string | number | undefined) {
  return (
    // number that is not NaN or Infinity
    (typeof xOrY === 'number' && Number.isFinite(xOrY)) ||
    // for percentage
    typeof xOrY === 'string'
  )
}

export interface UseTextResult {
  wordsByLines: ComputedRef<WordsWithWidth[]>
  startDy: ComputedRef<string>
  transform: ComputedRef<string>
}

/**
 * Vue composable that calculates SVG text wrapping, positioning, and transforms.
 * Must be called inside setup(). Props should be the reactive props object from defineComponent.
 */
export default function useText(props: TextProps): UseTextResult {
  const wordsWithWidthResult = computed(() => {
    const children = props.text
    const style = props.style
    const words: string[] = children == null ? [] : children.toString().split(/(?:(?!\u00A0+)\s+)/)
    return {
      wordsWithWidth: words.map((word) => ({
        word,
        wordWidth: getStringWidth(word, style) || 0
      })),
      spaceWidth: getStringWidth('\u00A0', style) || 0
    }
  })

  const wordsByLines = computed<WordsWithWidth[]>(() => {
    const x = props.x ?? 0
    const y = props.y ?? 0
    const width = props.width
    const scaleToFit = props.scaleToFit ?? false
    const children = props.text
    const isXOrYNotValid = !isXOrYInValid(x) || !isXOrYInValid(y)

    if (isXOrYNotValid) {
      return []
    }

    const { wordsWithWidth, spaceWidth } = wordsWithWidthResult.value

    // Only perform calculations if using features that require them (multiline, scaleToFit)
    if (width || scaleToFit) {
      return wordsWithWidth.reduce((result: WordsWithWidth[], { word, wordWidth }) => {
        const currentLine = result[result.length - 1]

        if (
          currentLine &&
          (width == null || scaleToFit || (currentLine.width || 0) + wordWidth + spaceWidth < width)
        ) {
          // Word can be added to an existing line
          currentLine.words.push(word)
          currentLine.width = currentLine.width || 0
          currentLine.width += wordWidth + spaceWidth
        } else {
          // Add first word to line or word is too long to scaleToFit on existing line
          const newLine = { words: [word], width: wordWidth }
          result.push(newLine)
        }

        return result
      }, [])
    }

    return [
      {
        words: children == null ? [] : children.toString().split(/(?:(?!\u00A0+)\s+)/)
      }
    ]
  })

  const startDy = computed(() => {
    const verticalAnchor = props.verticalAnchor ?? 'end'
    const capHeight = props.capHeight ?? '0.71em'
    const lineHeight = props.lineHeight ?? '1em'
    const x = props.x ?? 0
    const y = props.y ?? 0
    const isXOrYNotValid = !isXOrYInValid(x) || !isXOrYInValid(y)

    return isXOrYNotValid
      ? ''
      : verticalAnchor === 'start'
        ? reduceCSSCalc(`calc(${capHeight})`)
        : verticalAnchor === 'middle'
          ? reduceCSSCalc(
              `calc(${(wordsByLines.value.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`
            )
          : reduceCSSCalc(`calc(${wordsByLines.value.length - 1} * -${lineHeight})`)
  })

  const transform = computed(() => {
    const x = props.x ?? 0
    const y = props.y ?? 0
    const width = props.width
    const scaleToFit = props.scaleToFit ?? false
    const angle = props.angle
    const isXOrYNotValid = !isXOrYInValid(x) || !isXOrYInValid(y)

    const transforms: string[] = []
    if (isXOrYNotValid) {
      return ''
    }

    if (
      isNumber(x) &&
      isNumber(y) &&
      isNumber(width) &&
      scaleToFit &&
      wordsByLines.value.length > 0
    ) {
      const lineWidth = wordsByLines.value[0].width || 1
      const sx = scaleToFit === 'shrink-only' ? Math.min(width / lineWidth, 1) : width / lineWidth
      const sy = sx
      const originX = x - sx * x
      const originY = y - sy * y
      transforms.push(`matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`)
    }
    if (angle) {
      transforms.push(`rotate(${angle}, ${x}, ${y})`)
    }

    return transforms.length > 0 ? transforms.join(' ') : ''
  })

  return { wordsByLines, startDy, transform }
}
