import type { InjectionKey } from 'vue'
import { inject } from 'vue'
import type { XYChartTheme } from '../types/theme'
import lightTheme from '../theme/themes/light'

/** InjectionKey for ThemeContext. */
export const ThemeContextKey: InjectionKey<XYChartTheme> = Symbol('ThemeContext')

/** Composable to inject ThemeContext. Defaults to lightTheme if not provided. */
export function useThemeContext() {
  return inject(ThemeContextKey, lightTheme)
}
