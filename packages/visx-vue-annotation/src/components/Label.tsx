import { defineComponent, ref, type PropType, type CSSProperties, type SVGAttributes } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { Group } from '@visx-vue/group'
import { Text, useText } from '@visx-vue/text'
import type { TextProps } from '@visx-vue/text'
import { useAnnotationContext } from '../context'
import AnchorLine from './LabelAnchorLine'

export type LabelProps = {
  /** Stroke color of anchor line. */
  anchorLineStroke?: string
  /** Background color of label. */
  backgroundFill?: string
  /** Padding of text from background. */
  backgroundPadding?: number | { top?: number; right?: number; bottom?: number; left?: number }
  /** Additional props to be passed to background SVGRectElement. */
  backgroundProps?: SVGAttributes
  /** Optional className to apply to container in addition to 'visx-annotation-label'. */
  className?: string
  /** Color of title and subtitle text. */
  fontColor?: string
  /** Whether the label is horizontally anchored to the start, middle, or end of its x position. */
  horizontalAnchor?: 'start' | 'middle' | 'end' | 'inherit'
  /** Optionally inject a ResizeObserver polyfill, else this *must* be globally available. */
  resizeObserverPolyfill?: unknown
  /** Whether to render a line indicating label text anchor. */
  showAnchorLine?: boolean
  /** Whether to render a label background. */
  showBackground?: boolean
  /** Optional subtitle. */
  subtitle?: string
  /** Optional title font size. */
  subtitleFontSize?: number | string
  /** Optional title font weight. */
  subtitleFontWeight?: number | string
  /** The vertical offset of the subtitle from the title. */
  subtitleDy?: number
  /** Optional subtitle Text props (to override color, etc.). */
  subtitleProps?: Partial<TextProps>
  /** Optional title. */
  title?: string
  /** Optional title font size. */
  titleFontSize?: number | string
  /** Optional title font weight. */
  titleFontWeight?: number | string
  /** Optional title Text props (to override color, etc.). */
  titleProps?: Partial<TextProps>
  /** Whether the label is vertically anchored to the start, middle, or end of its y position. */
  verticalAnchor?: 'start' | 'middle' | 'end'
  /** Width of annotation, including background, for text wrapping. */
  width?: number
  /** Max width of annotation, including background, for text wrapping. */
  maxWidth?: number
  /** Left offset of entire AnnotationLabel, if not specified uses x + dx from Annotation. */
  x?: number
  /** Top offset of entire AnnotationLabel, if not specified uses y + dy from Annotation. */
  y?: number
}

const DEFAULT_PADDING = { top: 12, right: 12, bottom: 12, left: 12 }

function getCompletePadding(padding: LabelProps['backgroundPadding']) {
  if (typeof padding === 'undefined') return DEFAULT_PADDING
  if (typeof padding === 'number') {
    return { top: padding, right: padding, bottom: padding, left: padding }
  }
  return { ...DEFAULT_PADDING, ...padding }
}

export const Label = defineComponent({
  name: 'Label',
  props: {
    anchorLineStroke: { type: String as PropType<string>, default: '#222' },
    backgroundFill: { type: String as PropType<string>, default: '#eaeaea' },
    backgroundPadding: {
      type: [Number, Object] as PropType<LabelProps['backgroundPadding']>,
      default: undefined
    },
    backgroundProps: { type: Object as PropType<SVGAttributes>, default: undefined },
    className: { type: String as PropType<string>, default: undefined },
    fontColor: { type: String as PropType<string>, default: '#222' },
    horizontalAnchor: {
      type: String as PropType<'start' | 'middle' | 'end' | 'inherit'>,
      default: undefined
    },
    resizeObserverPolyfill: { type: Function as PropType<unknown>, default: undefined },
    showAnchorLine: { type: Boolean as PropType<boolean>, default: true },
    showBackground: { type: Boolean as PropType<boolean>, default: true },
    subtitle: { type: String as PropType<string>, default: undefined },
    subtitleFontSize: { type: [Number, String] as PropType<number | string>, default: 12 },
    subtitleFontWeight: { type: [Number, String] as PropType<number | string>, default: 200 },
    subtitleDy: { type: Number as PropType<number>, default: 4 },
    subtitleProps: { type: Object as PropType<Partial<TextProps>>, default: undefined },
    title: { type: String as PropType<string>, default: undefined },
    titleFontSize: { type: [Number, String] as PropType<number | string>, default: 16 },
    titleFontWeight: { type: [Number, String] as PropType<number | string>, default: 600 },
    titleProps: { type: Object as PropType<Partial<TextProps>>, default: undefined },
    verticalAnchor: {
      type: String as PropType<'start' | 'middle' | 'end'>,
      default: undefined
    },
    width: { type: Number as PropType<number>, default: undefined },
    maxWidth: { type: Number as PropType<number>, default: 125 },
    x: { type: Number as PropType<number>, default: undefined },
    y: { type: Number as PropType<number>, default: undefined }
  },
  setup(props) {
    const annotationContext = useAnnotationContext()

    // Refs for measuring rendered text elements
    const titleTextRef = ref<SVGTextElement | null>(null)
    const subtitleTextRef = ref<SVGTextElement | null>(null)
    const titleBounds = useElementBounding(titleTextRef)
    const subtitleBounds = useElementBounding(subtitleTextRef)

    // useText for title width calculation — proxy ensures reactive tracking
    const titleUseTextProps: TextProps = new Proxy({} as TextProps, {
      get(_, key: string) {
        const tp = props.titleProps as Record<string, unknown> | undefined
        if (tp && key in tp) return tp[key]
        switch (key) {
          case 'children':
            return props.title
          case 'verticalAnchor':
            return 'start'
          case 'capHeight':
            return props.titleFontSize
          case 'fontSize':
            return props.titleFontSize
          case 'fontFamily':
            return props.titleProps?.fontFamily
          case 'width':
            return props.maxWidth
          case 'style':
            return {
              fontSize: props.titleFontSize,
              fontWeight: props.titleFontWeight,
              fontFamily: props.titleProps?.fontFamily
            } as CSSProperties
          default:
            return undefined
        }
      }
    })
    const { wordsByLines: titleWordsByLines } = useText(titleUseTextProps)

    // useText for subtitle width calculation
    const subtitleUseTextProps: TextProps = new Proxy({} as TextProps, {
      get(_, key: string) {
        const sp = props.subtitleProps as Record<string, unknown> | undefined
        if (sp && key in sp) return sp[key]
        switch (key) {
          case 'children':
            return props.subtitle
          case 'verticalAnchor':
            return 'start'
          case 'capHeight':
            return props.subtitleFontSize
          case 'fontSize':
            return props.subtitleFontSize
          case 'fontFamily':
            return props.subtitleProps?.fontFamily
          case 'width':
            return props.maxWidth
          case 'style':
            return {
              fontSize: props.subtitleFontSize,
              fontWeight: props.subtitleFontWeight,
              fontFamily: props.subtitleProps?.fontFamily
            } as CSSProperties
          default:
            return undefined
        }
      }
    })
    const { wordsByLines: subtitleWordsByLines } = useText(subtitleUseTextProps)

    return () => {
      if (!props.title && !props.subtitle) return null

      const padding = getCompletePadding(props.backgroundPadding)
      const titleHeight = titleBounds.height.value ?? 0
      const subtitleHeight = subtitleBounds.height.value ?? 0
      const height = Math.floor(padding.top + padding.bottom + titleHeight + subtitleHeight)

      const titleMeasuredWidth = (titleWordsByLines.value as Array<{ width?: number }>).reduce(
        (maxTitleWidth, line) => Math.max(maxTitleWidth, line.width ?? 0),
        0
      )
      const subtitleMeasuredWidth = (
        subtitleWordsByLines.value as Array<{ width?: number }>
      ).reduce((maxSubtitleWidth, line) => Math.max(maxSubtitleWidth, line.width ?? 0), 0)
      const textMeasuredWidth = Math.ceil(
        Math.min(props.maxWidth!, Math.max(titleMeasuredWidth, subtitleMeasuredWidth))
      )
      const measuredWidth = padding.right + padding.left + textMeasuredWidth
      const width = props.width ?? measuredWidth
      const innerWidth = width - padding.left - padding.right

      const { x: ctxX = 0, y: ctxY = 0, dx = 0, dy = 0 } = annotationContext.value

      const horizontalAnchor =
        props.horizontalAnchor ||
        (Math.abs(dx) < Math.abs(dy) ? 'middle' : dx > 0 ? 'start' : 'end')
      const verticalAnchor =
        props.verticalAnchor || (Math.abs(dx) > Math.abs(dy) ? 'middle' : dy > 0 ? 'start' : 'end')

      let adjustedX: number = props.x == null ? ctxX + dx : props.x
      let adjustedY: number = props.y == null ? ctxY + dy : props.y

      if (horizontalAnchor === 'middle') adjustedX -= width / 2
      if (horizontalAnchor === 'end') adjustedX -= width
      if (verticalAnchor === 'middle') adjustedY -= height / 2
      if (verticalAnchor === 'end') adjustedY -= height

      const titleStyle = {
        fontSize: props.titleFontSize,
        fontWeight: props.titleFontWeight,
        fontFamily: props.titleProps?.fontFamily
      } as CSSProperties

      const subtitleStyle = {
        fontSize: props.subtitleFontSize,
        fontWeight: props.subtitleFontWeight,
        fontFamily: props.subtitleProps?.fontFamily
      } as CSSProperties

      return (
        <Group
          top={adjustedY}
          left={adjustedX}
          className={['visx-annotationlabel', props.className].filter(Boolean).join(' ')}
          {...({
            'pointer-events': 'none',
            opacity: titleHeight === 0 && subtitleHeight === 0 ? 0 : 1
          } as any)}
        >
          {props.showBackground && (
            <rect
              class="visx-annotationlabel-background"
              fill={props.backgroundFill}
              x={0}
              y={0}
              width={width}
              height={height}
              {...(props.backgroundProps || {})}
            />
          )}
          {props.showAnchorLine && (
            <AnchorLine
              anchorLineOrientation={Math.abs(dx) > Math.abs(dy) ? 'vertical' : 'horizontal'}
              anchorLineStroke={props.anchorLineStroke!}
              verticalAnchor={verticalAnchor as 'start' | 'middle' | 'end'}
              horizontalAnchor={horizontalAnchor}
              width={width}
              height={height}
            />
          )}
          {props.title && (
            <Text
              innerTextRef={titleTextRef}
              fill={props.fontColor}
              verticalAnchor="start"
              x={padding.left + (props.titleProps?.textAnchor === 'middle' ? innerWidth / 2 : 0)}
              y={padding.top}
              width={innerWidth}
              capHeight={props.titleFontSize}
              style={titleStyle}
              {...(props.titleProps || {})}
              text={props.title}
            />
          )}
          {props.subtitle && (
            <Text
              innerTextRef={subtitleTextRef}
              fill={props.fontColor}
              verticalAnchor="start"
              x={padding.left + (props.subtitleProps?.textAnchor === 'middle' ? innerWidth / 2 : 0)}
              y={padding.top + titleHeight}
              dy={props.title ? props.subtitleDy : 0}
              width={innerWidth}
              capHeight={props.subtitleFontSize}
              style={subtitleStyle}
              {...(props.subtitleProps || {})}
              text={props.subtitle}
            />
          )}
        </Group>
      )
    }
  }
})

export default Label
