import { defineComponent, useSlots, type PropType } from 'vue'
import { Group } from '@visx-vue/group'
import type { BaseDatum, CloudWord, WordcloudConfig } from './types'
import { useWordcloud } from './useWordcloud'

export type WordcloudProps = WordcloudConfig<BaseDatum>

export type WordcloudSlotProps = {
  words: CloudWord[]
}

export const Wordcloud = defineComponent({
  name: 'Wordcloud',
  props: {
    width: { type: Number as PropType<number>, required: true as const },
    height: { type: Number as PropType<number>, required: true as const },
    words: { type: Array as PropType<BaseDatum[]>, required: true as const },
    padding: {
      type: [Number, Function] as PropType<WordcloudConfig<BaseDatum>['padding']>,
      default: undefined
    },
    font: {
      type: [String, Function] as PropType<WordcloudConfig<BaseDatum>['font']>,
      default: undefined
    },
    fontSize: {
      type: [Number, Function] as PropType<WordcloudConfig<BaseDatum>['fontSize']>,
      default: undefined
    },
    fontStyle: {
      type: [String, Function] as PropType<WordcloudConfig<BaseDatum>['fontStyle']>,
      default: undefined
    },
    fontWeight: {
      type: [String, Number, Function] as PropType<WordcloudConfig<BaseDatum>['fontWeight']>,
      default: undefined
    },
    rotate: {
      type: [Number, Function] as PropType<WordcloudConfig<BaseDatum>['rotate']>,
      default: undefined
    },
    spiral: {
      type: [String, Function] as PropType<WordcloudConfig<BaseDatum>['spiral']>,
      default: undefined
    },
    random: {
      type: Function as PropType<WordcloudConfig<BaseDatum>['random']>,
      default: undefined
    }
  },
  setup(props) {
    const slots = useSlots()
    const words = useWordcloud(props)

    return () => {
      if (props.width === 0 || props.height === 0) return null

      return (
        <svg
          width={props.width}
          height={props.height}
        >
          <Group
            left={props.width / 2}
            top={props.height / 2}
          >
            {slots.default?.({ words: words.value })}
          </Group>
        </svg>
      )
    }
  }
})
