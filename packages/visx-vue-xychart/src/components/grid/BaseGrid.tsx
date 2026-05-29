import { defineComponent, useAttrs, type Component, type PropType } from 'vue'
import type { CommonGridProps } from '@visx-vue/grid'
import { useDataContext } from '../../context/DataContext'

export type BaseGridProps = {
  /** Whether to render GridRows. */
  rows?: boolean
  /** Whether to render GridColumns. */
  columns?: boolean
  /** Rendered GridRows component which is passed GridRowProps by BaseGrid. */
  GridRowsComponent: Component
  /** Rendered GridColumns component which is passed GridColumnsProps by BaseGrid. */
  GridColumnsComponent: Component
} & CommonGridProps

const BaseGrid = defineComponent({
  name: 'BaseGrid',
  inheritAttrs: false,
  props: {
    rows: { type: Boolean as PropType<boolean>, default: true },
    columns: { type: Boolean as PropType<boolean>, default: true },
    GridRowsComponent: { type: [Object, Function] as PropType<Component>, required: true },
    GridColumnsComponent: { type: [Object, Function] as PropType<Component>, required: true }
  },
  setup(props) {
    const attrs = useAttrs()
    const dataContext = useDataContext()

    return () => {
      const {
        theme,
        xScale: columnsScale,
        yScale: rowsScale,
        margin,
        innerWidth,
        innerHeight
      } = dataContext

      const gridLineStyles = theme?.gridStyles
      const RowsComp = props.GridRowsComponent as any
      const ColsComp = props.GridColumnsComponent as any

      return (
        <>
          {props.rows && rowsScale && innerWidth != null && (
            <RowsComp
              left={margin?.left}
              lineStyle={gridLineStyles}
              width={innerWidth}
              scale={rowsScale}
              {...attrs}
            />
          )}
          {props.columns && columnsScale && innerHeight != null && (
            <ColsComp
              top={margin?.top}
              lineStyle={gridLineStyles}
              height={innerHeight}
              scale={columnsScale}
              {...attrs}
            />
          )}
        </>
      )
    }
  }
})

export default BaseGrid
