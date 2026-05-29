import { defineComponent, useSlots, type PropType } from 'vue'
import type { Chords } from 'd3-chord'
import { chord as d3chord } from 'd3-chord'

type DefaultSortComparator = (a: number, b: number) => number

export type ChordProps = {
  /** Square data matrix of size n×n, where the matrix represents the directed flow amongst a network (a complete digraph) of `n` nodes. */
  matrix: number[][]
  /** Sets the pad angle between adjacent groups to the specified number in radians. */
  padAngle?: number
  /** Comparator used to sort the groups by their total outflow. */
  sortGroups?: DefaultSortComparator | null
  /** Comparator used to sort the subgroups corresponding to `matrix[i][0 … n - 1]` for a given group i by their total outflow. */
  sortSubgroups?: DefaultSortComparator | null
  /** Comparator used to sort the chords by their combined flow; this only affects the `z-order` of the chords. */
  sortChords?: DefaultSortComparator | null
}

export type ChordSlotProps = {
  chords: Chords
}

export const Chord = defineComponent({
  name: 'Chord',
  props: {
    matrix: { type: Array as PropType<number[][]>, required: true as const },
    padAngle: { type: Number as PropType<number>, default: undefined },
    sortGroups: {
      type: [Function, null] as unknown as PropType<DefaultSortComparator | null>,
      default: undefined
    },
    sortSubgroups: {
      type: [Function, null] as unknown as PropType<DefaultSortComparator | null>,
      default: undefined
    },
    sortChords: {
      type: [Function, null] as unknown as PropType<DefaultSortComparator | null>,
      default: undefined
    }
  },
  setup(props) {
    const slots = useSlots()

    return () => {
      const chord = d3chord()
      if (props.padAngle) chord.padAngle(props.padAngle)
      if (props.sortGroups) chord.sortGroups(props.sortGroups)
      if (props.sortSubgroups) chord.sortSubgroups(props.sortSubgroups)
      if (props.sortChords) chord.sortChords(props.sortChords)
      const chords = chord(props.matrix)
      if (slots.default) return slots.default({ chords })
      return <g />
    }
  }
})
