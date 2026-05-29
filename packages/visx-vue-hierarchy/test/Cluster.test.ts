import { describe, test, expect, vi } from 'vite-plus/test'
import { mount } from '@vue/test-utils'
import { hierarchy } from 'd3-hierarchy'
import { Cluster } from '../src'

type Datum = { name: string; children?: Datum[] }

const mockHierarchy = hierarchy<Datum>({
  name: 'Eve',
  children: [
    { name: 'Cain' },
    {
      name: 'Seth',
      children: [{ name: 'Enos' }, { name: 'Noam' }]
    }
  ]
})

describe('<Cluster />', () => {
  test('it should be defined', () => {
    expect(Cluster).toBeDefined()
  })

  test('it should call the default slot with required args', () => {
    // DEVIATION: React uses render-prop children; Vue uses scoped default slot
    const slotFn = vi.fn(() => null)
    mount(Cluster, {
      props: { root: mockHierarchy },
      slots: { default: slotFn }
    })
    expect(slotFn).toHaveBeenCalledTimes(1)
    const args = slotFn.mock.calls[0][0]
    expect(args.data).toBeDefined()
  })
})
