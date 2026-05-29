import { defineComponent, ref, watchEffect, useAttrs, type PropType, type CSSProperties } from 'vue'
import useText from './hooks/useText'
import type { TextProps } from './types'

const SVG_STYLE = { overflow: 'visible' } as CSSProperties

export { TextProps }

export const Text = defineComponent({
  name: 'Text',
  inheritAttrs: false,
  props: {
    className: { type: String as PropType<string>, default: undefined },
    scaleToFit: {
      type: [Boolean, String] as PropType<boolean | 'shrink-only'>,
      default: false
    },
    angle: { type: Number as PropType<number>, default: undefined },
    textAnchor: {
      type: String as PropType<'start' | 'middle' | 'end' | 'inherit'>,
      default: 'start'
    },
    verticalAnchor: {
      type: String as PropType<'start' | 'middle' | 'end'>,
      default: undefined
    },
    style: { type: Object as PropType<CSSProperties>, default: undefined },
    innerRef: {
      type: Object as PropType<{ value: SVGSVGElement | null }>,
      default: undefined
    },
    innerTextRef: {
      type: Object as PropType<{ value: SVGTextElement | null }>,
      default: undefined
    },
    x: { type: [String, Number] as PropType<string | number>, default: 0 },
    y: { type: [String, Number] as PropType<string | number>, default: undefined },
    dx: { type: [String, Number] as PropType<string | number>, default: 0 },
    dy: { type: [String, Number] as PropType<string | number>, default: 0 },
    lineHeight: { type: [String, Number] as PropType<string | number>, default: '1em' },
    capHeight: { type: [String, Number] as PropType<string | number>, default: undefined },
    fontSize: { type: [String, Number] as PropType<string | number>, default: undefined },
    fontFamily: { type: String as PropType<string>, default: undefined },
    fill: { type: String as PropType<string>, default: undefined },
    width: { type: Number as PropType<number>, default: undefined },
    text: { type: [String, Number] as PropType<string | number>, default: undefined }
  },
  setup(props, { expose }) {
    const attrs = useAttrs()
    const localSvgRef = ref<SVGSVGElement | null>(null)
    const localTextRef = ref<SVGTextElement | null>(null)

    expose({ svgElement: localSvgRef, textElement: localTextRef })

    // Sync innerRef / innerTextRef props with local refs
    watchEffect(() => {
      if (props.innerRef) props.innerRef.value = localSvgRef.value
    })
    watchEffect(() => {
      if (props.innerTextRef) props.innerTextRef.value = localTextRef.value
    })

    // Build the props object that useText expects.
    // We pass a reactive getter wrapper so useText's computed values
    // re-evaluate when any prop changes.
    const textProps = new Proxy({} as TextProps, {
      get(_target, key: string) {
        return (props as Record<string, unknown>)[key]
      }
    })

    const { wordsByLines, startDy, transform } = useText(textProps)

    return () => {
      // Collect text-element attrs (everything except our own managed props)
      const {
        className: _className,
        scaleToFit: _scaleToFit,
        verticalAnchor: _verticalAnchor,
        capHeight: _capHeight,
        width: _width,
        innerRef: _innerRef,
        innerTextRef: _innerTextRef,
        text: _text,
        dx: _dx,
        dy: _dy,
        angle: _angle,
        ...restTextAttrs
      } = attrs as Record<string, unknown>

      const svgAttrs: Record<string, unknown> = {
        x: props.dx,
        y: props.dy,
        style: SVG_STYLE
      }
      if (props.fontSize != null) {
        svgAttrs['font-size'] = props.fontSize
      }

      const textAttrs: Record<string, unknown> = {
        transform: transform.value,
        x: props.x,
        y: props.y,
        'text-anchor': props.textAnchor,
        fill: props.fill,
        'font-family': props.fontFamily,
        'font-size': props.fontSize,
        style: props.style,
        ...restTextAttrs
      }

      return (
        <svg
          ref={localSvgRef}
          {...svgAttrs}
        >
          {wordsByLines.value.length > 0 ? (
            <text
              ref={localTextRef}
              class={props.className}
              {...textAttrs}
            >
              {wordsByLines.value.map((line, index) => (
                <tspan
                  key={index}
                  x={props.x}
                  dy={index === 0 ? startDy.value : props.lineHeight}
                >
                  {line.words.join(' ')}
                </tspan>
              ))}
            </text>
          ) : null}
        </svg>
      )
    }
  }
})
