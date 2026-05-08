let originalFn: typeof SVGElement.prototype.getComputedTextLength | undefined;

/**
 * JSDom does not implement getComputedTextLength()
 * so this function adds a mock implementation for testing.
 */
export function addMock() {
  // @ts-expect-error - accessing prototype property
  originalFn = SVGElement.prototype.getComputedTextLength;

  // @ts-expect-error - mock implementation
  SVGElement.prototype.getComputedTextLength = function getComputedTextLength() {
    // Make every character 10px wide
    return (this.textContent?.length ?? 0) * 10;
  };
}

/**
 * Remove mock from addMock()
 */
export function removeMock() {
  // @ts-expect-error - restoring original
  SVGElement.prototype.getComputedTextLength = originalFn;
}
