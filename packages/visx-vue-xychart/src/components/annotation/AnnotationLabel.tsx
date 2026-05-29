import { defineComponent, useAttrs, useSlots, type SVGAttributes } from 'vue'
import { Label as BaseLabel } from '@visx-vue/annotation'
import type { LabelProps as BaseLabelProps } from '@visx-vue/annotation'
import { useDataContext } from '../../context/DataContext'

export type AnnotationLabelProps = BaseLabelProps

const defaultBackgroundProps = { 'fill-opacity': 0.7 } as SVGAttributes

/** AnnotationLabel which provides text styles from theme. */
const AnnotationLabel = defineComponent({
  name: 'AnnotationLabel',
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const slots = useSlots()
    const dataContext = useDataContext()

    return () => {
      const { theme, resizeObserverPolyfill } = dataContext
      const titleProps = theme?.svgLabelBig
      const subtitleProps = theme?.svgLabelSmall
      return (
        <BaseLabel
          anchorLineStroke={theme?.axisStyles.x.bottom.axisLine.stroke as string | undefined}
          backgroundFill={theme?.backgroundColor}
          backgroundProps={defaultBackgroundProps}
          showAnchorLine
          subtitleFontSize={subtitleProps?.fontSize as string | number | undefined}
          subtitleFontWeight={subtitleProps?.fontWeight as string | number | undefined}
          subtitleProps={subtitleProps}
          titleFontSize={titleProps?.fontSize as string | number | undefined}
          titleFontWeight={titleProps?.fontWeight as string | number | undefined}
          titleProps={titleProps}
          resizeObserverPolyfill={resizeObserverPolyfill as undefined}
          {...attrs}
        >
          {slots.default?.()}
        </BaseLabel>
      )
    }
  }
})

export default AnnotationLabel
