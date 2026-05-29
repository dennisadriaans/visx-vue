import * as pkg from '../src/internmap'
import { describe, it, expect } from 'vite-plus/test'

describe('internmap', () => {
  it('should be defined', () => {
    expect(pkg).toBeDefined()
    expect(Object.keys(pkg).length).toBeGreaterThan(0)
  })
})
