import { defineComponent, useAttrs } from 'vue'
import { Connector as BaseConnector } from '@visx-vue/annotation'
import type { ConnectorProps as BaseConnectorProps } from '@visx-vue/annotation'
import { useDataContext } from '../../context/DataContext'

export type AnnotationConnectorProps = BaseConnectorProps

/** AnnotationConnector which provides color from theme. */
const AnnotationConnector = defineComponent({
  name: 'AnnotationConnector',
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const dataContext = useDataContext()

    return () => {
      const { theme } = dataContext
      return (
        <BaseConnector
          stroke={theme?.axisStyles.x.bottom.axisLine.stroke as string | undefined}
          {...attrs}
        />
      )
    }
  }
})

export default AnnotationConnector
