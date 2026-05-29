import { defineComponent, useAttrs } from 'vue'
import { CircleSubject as BaseCircleSubject } from '@visx-vue/annotation'
import type { CircleSubjectProps } from '@visx-vue/annotation'
import { useDataContext } from '../../context/DataContext'

export type AnnotationCircleSubjectProps = CircleSubjectProps

/** AnnotationCircleSubject which provides color from theme. */
const AnnotationCircleSubject = defineComponent({
  name: 'AnnotationCircleSubject',
  inheritAttrs: false,
  setup() {
    const attrs = useAttrs()
    const dataContext = useDataContext()

    return () => {
      const { theme } = dataContext
      return (
        <BaseCircleSubject
          stroke={theme?.axisStyles.x.bottom.axisLine.stroke as string | undefined}
          {...attrs}
        />
      )
    }
  }
})

export default AnnotationCircleSubject
