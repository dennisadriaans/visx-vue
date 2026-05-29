let originalFn: typeof SVGElement.prototype.getComputedTextLength | undefined

export function addMock() {
  // @ts-expect-error - accessing prototype property
  originalFn = SVGElement.prototype.getComputedTextLength
  // @ts-expect-error - mock implementation
  SVGElement.prototype.getComputedTextLength = function getComputedTextLength() {
    return (this.textContent?.length ?? 0) * 10
  }
}

export function removeMock() {
  // @ts-expect-error - restoring original
  SVGElement.prototype.getComputedTextLength = originalFn
}
