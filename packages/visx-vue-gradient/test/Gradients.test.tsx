import { describe, test, expect } from 'vite-plus/test'
import { mount } from '@vue/test-utils'

import {
  GradientDarkgreenGreen,
  GradientLightgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleRed,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue
} from '../src'

// DEVIATION: preset gradient components pass `id` via attrs (inheritAttrs: false + useAttrs()),
// so we use mount() with attrs option instead of JSX to avoid Vue JSX type errors.

describe('<GradientDarkgreenGreen />', () => {
  test('it should be defined', () => {
    expect(GradientDarkgreenGreen).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientDarkgreenGreen, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientLightgreenGreen />', () => {
  test('it should be defined', () => {
    expect(GradientLightgreenGreen).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientLightgreenGreen, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientOrangeRed />', () => {
  test('it should be defined', () => {
    expect(GradientOrangeRed).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientOrangeRed, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientPinkBlue />', () => {
  test('it should be defined', () => {
    expect(GradientPinkBlue).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientPinkBlue, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientPinkRed />', () => {
  test('it should be defined', () => {
    expect(GradientPinkRed).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientPinkRed, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientPurpleOrange />', () => {
  test('it should be defined', () => {
    expect(GradientPurpleOrange).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientPurpleOrange, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientPurpleRed />', () => {
  test('it should be defined', () => {
    expect(GradientPurpleRed).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientPurpleRed, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientPurpleTeal />', () => {
  test('it should be defined', () => {
    expect(GradientPurpleTeal).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientPurpleTeal, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientSteelPurple />', () => {
  test('it should be defined', () => {
    expect(GradientSteelPurple).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientSteelPurple, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})

describe('<GradientTealBlue />', () => {
  test('it should be defined', () => {
    expect(GradientTealBlue).toBeDefined()
  })

  test('it should render without crashing', () => {
    expect(() => mount(GradientTealBlue, { attrs: { id: 'gradient' } })).not.toThrow()
  })
})
