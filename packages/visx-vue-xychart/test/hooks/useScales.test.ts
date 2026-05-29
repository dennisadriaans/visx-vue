// @vitest-environment jsdom
import { describe, it, expect } from 'vite-plus/test'
import useScales from '../../src/hooks/useScales'

describe('useScales', () => {
  it('should be defined', () => {
    expect(useScales).toBeDefined()
  })
})
