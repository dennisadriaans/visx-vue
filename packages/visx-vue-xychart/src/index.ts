// @visx-vue/xychart

// components
export { default as Annotation } from "./components/annotation/Annotation";
export { default as AnimatedAnnotation } from "./components/annotation/AnimatedAnnotation";
export { default as AnnotationLabel } from "./components/annotation/AnnotationLabel";
export { default as AnnotationConnector } from "./components/annotation/AnnotationConnector";
export { default as AnnotationCircleSubject } from "./components/annotation/AnnotationCircleSubject";
export { default as AnnotationLineSubject } from "./components/annotation/AnnotationLineSubject";
export { default as AnimatedAxis } from "./components/axis/AnimatedAxis";
export { default as AnimatedGrid } from "./components/grid/AnimatedGrid";
export { default as Axis } from "./components/axis/Axis";
export { default as Grid } from "./components/grid/Grid";
export { default as Tooltip } from "./components/Tooltip";
export { default as XYChart } from "./components/XYChart";

// series components
export { default as AreaSeries } from "./components/series/AreaSeries";
export { default as AreaStack } from "./components/series/AreaStack";
export { default as BarGroup } from "./components/series/BarGroup";
export { default as BarSeries } from "./components/series/BarSeries";
export { default as BarStack } from "./components/series/BarStack";
export { default as GlyphSeries } from "./components/series/GlyphSeries";
export { default as LineSeries } from "./components/series/LineSeries";

// animated series components
export { default as AnimatedAreaSeries } from "./components/series/AnimatedAreaSeries";
export { default as AnimatedAreaStack } from "./components/series/AnimatedAreaStack";
export { default as AnimatedBarSeries } from "./components/series/AnimatedBarSeries";
export { default as AnimatedBarStack } from "./components/series/AnimatedBarStack";
export { default as AnimatedBarGroup } from "./components/series/AnimatedBarGroup";
export { default as AnimatedGlyphSeries } from "./components/series/AnimatedGlyphSeries";
export { default as AnimatedLineSeries } from "./components/series/AnimatedLineSeries";

// context
export { DataContextKey, useDataContext } from "./context/DataContext";
export { EventEmitterContextKey, useEventEmitterContext } from "./context/EventEmitterContext";
export { ThemeContextKey, useThemeContext } from "./context/ThemeContext";
export { TooltipContextKey, useTooltipContext } from "./context/TooltipContext";

// providers
export { default as DataProvider } from "./providers/DataProvider";
export { default as EventEmitterProvider } from "./providers/EventEmitterProvider";
export { default as ThemeProvider } from "./providers/ThemeProvider";
export { TooltipProvider } from "./providers/TooltipProvider";

// hooks
export { default as useEventEmitter } from "./hooks/useEventEmitter";

// themes
export { default as lightTheme } from "./theme/themes/light";
export { default as darkTheme } from "./theme/themes/dark";
export { default as buildChartTheme } from "./theme/buildChartTheme";
export { allColors, grayColors, defaultColors } from "./theme/colors";

// types
export type * from "./types";

// tooltip-specific types
export type {
  RenderTooltipParams,
  RenderTooltipGlyphProps,
  TooltipProps,
} from "./components/Tooltip";

// xychart-specific types
export type { XYChartProps } from "./components/XYChart";

// provider types
export type { DataProviderProps } from "./providers/DataProvider";
export type { ThemeProviderProps } from "./providers/ThemeProvider";
export type { TooltipProviderProps } from "./providers/TooltipProvider";

// theme types
export type { ThemeConfig } from "./theme/buildChartTheme";
