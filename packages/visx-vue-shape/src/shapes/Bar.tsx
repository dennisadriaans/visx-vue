import type { FunctionalComponent, SVGAttributes } from 'vue'

export type BarProps = {
  /** className to apply to rect element. */
  className?: string
}

export const Bar: FunctionalComponent<BarProps & SVGAttributes> = (props) => {
  const { className, ...rest } = props
  return (
    <rect
      class={['visx-bar', className]}
      {...rest}
    />
  )
}
Bar.displayName = 'Bar'

export default Bar
