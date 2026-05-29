import { describe, it, expect } from 'vite-plus/test'
import useLineTransitionConfig from '../src/spring-configs/useLineTransitionConfig'
import { scaleLinear } from '@visx-vue/scale'

const scale = scaleLinear({ domain: [0, 10], range: [0, 10] })
const invertedScale = scaleLinear({ domain: [0, 10], range: [10, 0] })
const verticalLine = { from: { x: 0, y: 0 }, to: { x: 0, y: 5 }, index: 0 }
const verticalLineMax = { from: { x: 8, y: 0 }, to: { x: 8, y: 5 }, index: 1 }

describe('useLineTransitionConfig', () => {
  it('should be defined', () => {
    expect(useLineTransitionConfig).toBeDefined()
  })

  it('should return config with from, enter, update, leave keys', () => {
    const result = useLineTransitionConfig({ scale, animateXOrY: 'x' })

    expect(result).toMatchObject({
      from: expect.any(Function),
      enter: expect.any(Function),
      update: expect.any(Function),
      leave: expect.any(Function)
    })
  })

  it('should animate from scale min', () => {
    const result = useLineTransitionConfig({
      scale,
      animateXOrY: 'x',
      animationTrajectory: 'min'
    })

    const invertedResult = useLineTransitionConfig({
      scale: invertedScale,
      animateXOrY: 'y',
      animationTrajectory: 'min'
    })

    expect(result.from(verticalLine).fromX).toBe(0)
    expect(invertedResult.from(verticalLine).fromY).toBe(10)
  })

  it('should animate from scale max', () => {
    const result = useLineTransitionConfig({
      scale,
      animateXOrY: 'x',
      animationTrajectory: 'max'
    })

    const invertedResult = useLineTransitionConfig({
      scale: invertedScale,
      animateXOrY: 'y',
      animationTrajectory: 'max'
    })

    expect(result.from(verticalLine).fromX).toBe(10)
    expect(invertedResult.from(verticalLine).fromY).toBe(0)
  })

  it('should animate from outside', () => {
    const result = useLineTransitionConfig({
      scale,
      animateXOrY: 'x',
      animationTrajectory: 'outside'
    })

    expect(result.from(verticalLine).fromX).toBe(0)
    expect(result.from(verticalLineMax).fromX).toBe(10)
  })

  it('should animate from center', () => {
    const result = useLineTransitionConfig({
      scale,
      animateXOrY: 'x',
      animationTrajectory: 'center'
    })

    expect(result.from(verticalLine).fromX).toBe(5)
  })
})
