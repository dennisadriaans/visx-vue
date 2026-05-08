import {
  defineComponent,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  type PropType,
  type SVGAttributes,
  type VNode,
} from "vue";
import { Group } from "@visx-vue/group";
import { Drag, type HandlerArgs as DragArgs } from "@visx-vue/drag";
import type { BrushHandleRenderProps } from "./BrushHandle";
import BrushHandle from "./BrushHandle";
import BrushCorner from "./BrushCorner";
import BrushSelection from "./BrushSelection";
import BrushOverlay from "./BrushOverlay";
import type {
  MarginShape,
  Point,
  BrushShape,
  ResizeTriggerAreas,
  PartialBrushStartEnd,
  BrushingType,
  BrushPageOffset,
} from "./types";
import { debounce, getPageCoordinates } from "./utils";

export type BaseBrushProps = {
  brushDirection?: "horizontal" | "vertical" | "both";
  initialBrushPosition?: PartialBrushStartEnd;
  width: number;
  height: number;
  left: number;
  top: number;
  inheritedMargin?: MarginShape;
  onChange?: (state: BaseBrushState) => void;
  handleSize: number;
  resizeTriggerAreas?: ResizeTriggerAreas[];
  onBrushStart?: (start: BaseBrushState["start"]) => void;
  onBrushEnd?: (state: BaseBrushState) => void;
  selectedBoxStyle: SVGAttributes;
  onMouseLeave?: (event: PointerEvent) => void;
  onMouseUp?: (event: PointerEvent) => void;
  onMouseMove?: (event: PointerEvent) => void;
  onClick?: (event: PointerEvent) => void;
  clickSensitivity: number;
  disableDraggingSelection: boolean;
  disableDraggingOverlay?: boolean;
  resetOnEnd?: boolean;
  useWindowMoveEvents?: boolean;
  renderBrushHandle?: (props: BrushHandleRenderProps) => VNode;
};

export type BaseBrushState = BrushShape & {
  activeHandle: ResizeTriggerAreas | null;
  isBrushing: boolean;
  brushPageOffset?: BrushPageOffset;
  brushingType?: BrushingType;
};

export type UpdateBrush =
  | BaseBrushState
  | ((prevState: Readonly<BaseBrushState>, props: Readonly<BaseBrushProps>) => BaseBrushState);

export const BaseBrush = defineComponent({
  name: "BaseBrush",
  props: {
    brushDirection: {
      type: String as PropType<"horizontal" | "vertical" | "both">,
      default: "both",
    },
    initialBrushPosition: {
      type: Object as PropType<PartialBrushStartEnd>,
      default: undefined,
    },
    width: { type: Number as PropType<number>, required: true },
    height: { type: Number as PropType<number>, required: true },
    left: { type: Number as PropType<number>, required: true },
    top: { type: Number as PropType<number>, required: true },
    inheritedMargin: {
      type: Object as PropType<MarginShape>,
      default: () => ({ left: 0, top: 0, right: 0, bottom: 0 }),
    },
    onChange: {
      type: Function as PropType<(state: BaseBrushState) => void>,
      default: undefined,
    },
    handleSize: { type: Number as PropType<number>, default: 4 },
    resizeTriggerAreas: {
      type: Array as PropType<ResizeTriggerAreas[]>,
      default: () => ["left", "right"],
    },
    onBrushStart: {
      type: Function as PropType<(start: BaseBrushState["start"]) => void>,
      default: undefined,
    },
    onBrushEnd: {
      type: Function as PropType<(state: BaseBrushState) => void>,
      default: undefined,
    },
    selectedBoxStyle: {
      type: Object as PropType<SVGAttributes>,
      required: true,
    },
    onMouseLeave: {
      type: Function as PropType<(event: PointerEvent) => void>,
      default: undefined,
    },
    onMouseUp: {
      type: Function as PropType<(event: PointerEvent) => void>,
      default: undefined,
    },
    onMouseMove: {
      type: Function as PropType<(event: PointerEvent) => void>,
      default: undefined,
    },
    onClick: {
      type: Function as PropType<(event: PointerEvent) => void>,
      default: undefined,
    },
    clickSensitivity: { type: Number as PropType<number>, default: 200 },
    disableDraggingSelection: { type: Boolean as PropType<boolean>, default: false },
    disableDraggingOverlay: { type: Boolean as PropType<boolean>, default: false },
    resetOnEnd: { type: Boolean as PropType<boolean>, default: false },
    useWindowMoveEvents: { type: Boolean as PropType<boolean>, default: false },
    renderBrushHandle: {
      type: Function as PropType<(props: BrushHandleRenderProps) => VNode>,
      default: undefined,
    },
  },
  setup(props, { expose }) {
    // --- Compute initial extent ---
    function getExtent(start: Partial<Point>, end: Partial<Point>) {
      const x0 = props.brushDirection === "vertical" ? 0 : Math.min(start.x || 0, end.x || 0);
      const x1 =
        props.brushDirection === "vertical" ? props.width : Math.max(start.x || 0, end.x || 0);
      const y0 = props.brushDirection === "horizontal" ? 0 : Math.min(start.y || 0, end.y || 0);
      const y1 =
        props.brushDirection === "horizontal" ? props.height : Math.max(start.y || 0, end.y || 0);

      return { x0, x1, y0, y1 };
    }

    const initialExtent = props.initialBrushPosition
      ? getExtent(props.initialBrushPosition.start, props.initialBrushPosition.end)
      : { x0: -1, x1: -1, y0: -1, y1: -1 };

    const state = reactive<BaseBrushState>({
      start: { x: Math.max(0, initialExtent.x0), y: Math.max(0, initialExtent.y0) },
      end: { x: Math.max(0, initialExtent.x1), y: Math.max(0, initialExtent.y1) },
      extent: { ...initialExtent },
      bounds: {
        x0: 0,
        x1: props.width,
        y0: 0,
        y1: props.height,
      },
      isBrushing: false,
      brushingType: undefined,
      activeHandle: null,
    });

    let mouseUpTime = 0;
    let mouseDownTime = 0;

    // --- Helper functions ---
    function getIdleState(): BaseBrushState {
      return {
        start: { x: 0, y: 0 },
        end: { x: 0, y: 0 },
        extent: { x0: -1, x1: -1, y0: -1, y1: -1 },
        bounds: { x0: 0, x1: props.width, y0: 0, y1: props.height },
        isBrushing: false,
        brushPageOffset: undefined,
        activeHandle: null,
        brushingType: undefined,
      };
    }

    function updateBrush(updater: UpdateBrush) {
      let nextState: BaseBrushState;
      if (typeof updater === "function") {
        // Pass a snapshot to the updater so it sees immutable prevState
        const snapshot = JSON.parse(JSON.stringify(state)) as BaseBrushState;
        nextState = updater(snapshot, props as unknown as BaseBrushProps);
      } else {
        nextState = updater;
      }
      // Apply all fields from nextState into reactive state
      Object.assign(state, nextState);
      if (props.onChange) {
        props.onChange({ ...state });
      }
    }

    function reset() {
      updateBrush(() => getIdleState());
    }

    function getBrushWidth() {
      const { x0, x1 } = state.extent;
      return Math.max(Math.max(x0, x1) - Math.min(x0, x1), 0);
    }

    function getBrushHeight() {
      const { y0, y1 } = state.extent;
      return Math.max(Math.max(y0, y1) - Math.min(y0, y1), 0);
    }

    function handles(): Partial<{
      [key in ResizeTriggerAreas]: { x: number; y: number; height: number; width: number };
    }> {
      const { x0, x1, y0, y1 } = state.extent;
      const offset = props.handleSize / 2;
      const width = getBrushWidth();
      const height = getBrushHeight();

      return {
        top: {
          x: x0 - offset,
          y: y0 - offset,
          height: props.handleSize,
          width: width + props.handleSize,
        },
        bottom: {
          x: x0 - offset,
          y: y1 - offset,
          height: props.handleSize,
          width: width + props.handleSize,
        },
        right: {
          x: x1 - offset,
          y: y0 - offset,
          height: height + props.handleSize,
          width: props.handleSize,
        },
        left: {
          x: x0 - offset,
          y: y0 - offset,
          height: height + props.handleSize,
          width: props.handleSize,
        },
      };
    }

    function corners(): Partial<{
      [key in ResizeTriggerAreas]: { x: number; y: number; width: number; height: number };
    }> {
      const { x0, x1, y0, y1 } = state.extent;
      const offset = props.handleSize / 2;
      const size = props.handleSize;

      return {
        topLeft: {
          x: Math.min(x0, x1) - offset,
          y: Math.min(y0, y1) - offset,
          width: size,
          height: size,
        },
        topRight: {
          x: Math.max(x0, x1) - offset,
          y: Math.min(y0, y1) - offset,
          width: size,
          height: size,
        },
        bottomLeft: {
          x: Math.min(x0, x1) - offset,
          y: Math.max(y0, y1) - offset,
          width: size,
          height: size,
        },
        bottomRight: {
          x: Math.max(x0, x1) - offset,
          y: Math.max(y0, y1) - offset,
          width: size,
          height: size,
        },
      };
    }

    // --- Drag handlers ---
    function handleDragStart(draw: DragArgs) {
      const marginLeft = props.inheritedMargin?.left ? props.inheritedMargin.left : 0;
      const marginTop = props.inheritedMargin?.top ? props.inheritedMargin.top : 0;
      const start = {
        x: (draw.x || 0) + draw.dx - props.left - marginLeft,
        y: (draw.y || 0) + draw.dy - props.top - marginTop,
      };
      const end = { ...start };

      if (props.onBrushStart) {
        props.onBrushStart(start);
      }

      updateBrush((prevBrush: BaseBrushState) => ({
        ...prevBrush,
        start,
        end,
        extent: { x0: -1, x1: -1, y0: -1, y1: -1 },
        isBrushing: true,
        brushingType: "select",
        brushPageOffset: props.useWindowMoveEvents ? getPageCoordinates(draw.event) : undefined,
      }));
    }

    function handleBrushStart(drag: DragArgs) {
      if (props.onBrushStart) {
        const marginLeft = props.inheritedMargin?.left ? props.inheritedMargin.left : 0;
        const marginTop = props.inheritedMargin?.top ? props.inheritedMargin.top : 0;
        const start = {
          x: (drag.x || 0) + drag.dx - props.left - marginLeft,
          y: (drag.y || 0) + drag.dy - props.top - marginTop,
        };
        props.onBrushStart(start);
      }
    }

    function handleDragMove(drag: DragArgs) {
      if (!drag.isDragging || props.useWindowMoveEvents) return;
      const marginLeft = props.inheritedMargin?.left || 0;
      const marginTop = props.inheritedMargin?.top || 0;
      const end = {
        x: (drag.x || 0) + drag.dx - props.left - marginLeft,
        y: (drag.y || 0) + drag.dy - props.top - marginTop,
      };
      updateBrush((prevBrush: BaseBrushState) => {
        const { start } = prevBrush;
        const extent = getExtent(start, end);
        return { ...prevBrush, end, extent };
      });
    }

    function handleDragEnd() {
      if (!props.useWindowMoveEvents) {
        updateBrush((prevBrush: BaseBrushState) => {
          const { extent } = prevBrush;
          let newState: BaseBrushState = {
            ...prevBrush,
            start: { x: extent.x0, y: extent.y0 },
            end: { x: extent.x1, y: extent.y1 },
            isBrushing: false,
            brushingType: undefined,
            activeHandle: null,
          };

          if (props.onBrushEnd) {
            props.onBrushEnd(newState);
          }

          if (props.resetOnEnd) {
            newState = { ...newState, ...getIdleState() };
          }

          return newState;
        });
      }
    }

    // --- Window move events ---
    function handleWindowPointerUp() {
      if (props.useWindowMoveEvents && state.brushingType) {
        updateBrush((prevBrush: BaseBrushState) => {
          const { start, end, extent } = prevBrush;
          const newStart = {
            x: Math.min(extent.x0, extent.x1),
            y: Math.min(extent.y0, extent.y0),
          };
          const newEnd = {
            x: Math.max(extent.x0, extent.x1),
            y: Math.max(extent.y0, extent.y1),
          };

          let newState: BaseBrushState = {
            ...prevBrush,
            start: newStart,
            end: newEnd,
            activeHandle: null,
            isBrushing: false,
            brushingType: undefined,
          };

          if (props.onBrushEnd) {
            props.onBrushEnd(newState);
          }

          if (props.resetOnEnd) {
            newState = { ...newState, ...getIdleState() };
          }

          return newState;
        });
      }
    }

    function handleWindowPointerMove(event: MouseEvent) {
      if (!props.useWindowMoveEvents || !state.isBrushing) return;

      const offsetX = event.pageX - (state.brushPageOffset?.pageX || 0);
      const offsetY = event.pageY - (state.brushPageOffset?.pageY || 0);
      const { brushingType } = state;

      if (["left", "right", "top", "bottom"].includes(brushingType ?? "")) {
        updateBrush((prevBrush: BaseBrushState) => {
          const { x: x0, y: y0 } = prevBrush.start;
          const { x: x1, y: y1 } = prevBrush.end;

          return {
            ...prevBrush,
            isBrushing: true,
            extent: {
              ...prevBrush.extent,
              ...getExtent(
                {
                  x:
                    brushingType === "left"
                      ? Math.min(Math.max(x0 + offsetX, prevBrush.bounds.x0), prevBrush.bounds.x1)
                      : x0,
                  y:
                    brushingType === "top"
                      ? Math.min(Math.max(y0 + offsetY, prevBrush.bounds.y0), prevBrush.bounds.y1)
                      : y0,
                },
                {
                  x:
                    brushingType === "right"
                      ? Math.min(Math.max(x1 + offsetX, prevBrush.bounds.x0), prevBrush.bounds.x1)
                      : x1,
                  y:
                    brushingType === "bottom"
                      ? Math.min(Math.max(y1 + offsetY, prevBrush.bounds.y0), prevBrush.bounds.y1)
                      : y1,
                },
              ),
            },
          };
        });
      }

      if (brushingType === "move") {
        updateBrush((prevBrush: BaseBrushState) => {
          const { x: x0, y: y0 } = prevBrush.start;
          const { x: x1, y: y1 } = prevBrush.end;
          const validDx =
            offsetX > 0
              ? Math.min(offsetX, prevBrush.bounds.x1 - x1)
              : Math.max(offsetX, prevBrush.bounds.x0 - x0);

          const validDy =
            offsetY > 0
              ? Math.min(offsetY, prevBrush.bounds.y1 - y1)
              : Math.max(offsetY, prevBrush.bounds.y0 - y0);

          return {
            ...prevBrush,
            isBrushing: true,
            extent: {
              ...prevBrush.extent,
              x0: x0 + validDx,
              y0: y0 + validDy,
              x1: x1 + validDx,
              y1: y1 + validDy,
            },
          };
        });
      }

      if (brushingType === "select") {
        updateBrush((prevBrush: BaseBrushState) => {
          const { x: x0, y: y0 } = prevBrush.start;
          const newEnd = {
            x: Math.min(Math.max(x0 + offsetX, prevBrush.bounds.x0), prevBrush.bounds.x1),
            y: Math.min(Math.max(y0 + offsetY, prevBrush.bounds.y0), prevBrush.bounds.y1),
          };
          const extent = getExtent(prevBrush.start, newEnd);

          return { ...prevBrush, end: newEnd, extent };
        });
      }
    }

    const debouncedHandleWindowPointerMove = debounce(
      handleWindowPointerMove as (...args: unknown[]) => unknown,
      1,
    );

    // --- Brushing type change handler ---
    function handleBrushingTypeChange(type?: BrushingType, brushPageOffset?: BrushPageOffset) {
      updateBrush((prevBrush: BaseBrushState) => {
        const next: BaseBrushState = {
          ...prevBrush,
          brushingType: type,
          isBrushing: type !== undefined,
        };

        if (brushPageOffset || type === undefined) {
          next.brushPageOffset = brushPageOffset;
        }

        return next;
      });
    }

    // --- Watch width/height changes ---
    watch(
      () => ({ width: props.width, height: props.height }),
      (newVal, oldVal) => {
        if (newVal.width !== oldVal?.width || newVal.height !== oldVal?.height) {
          let { start, end, extent } = { ...state };

          if (!(extent.x0 === -1 && extent.x1 === -1 && extent.y0 === -1 && extent.y1 === -1)) {
            const widthRatio = newVal.width / (oldVal?.width || 1);
            const heightRatio = newVal.height / (oldVal?.height || 1);

            start = {
              x: widthRatio * extent.x0,
              y: heightRatio * extent.y0,
            };

            end = {
              x: widthRatio * extent.x1,
              y: heightRatio * extent.y1,
            };

            extent = getExtent(start, end);
          }

          Object.assign(state, {
            start,
            end,
            extent,
            bounds: { x0: 0, x1: newVal.width, y0: 0, y1: newVal.height },
          });
        }
      },
    );

    // --- Window event listeners ---
    onMounted(() => {
      if (props.useWindowMoveEvents) {
        window.addEventListener("mouseup", handleWindowPointerUp);
        window.addEventListener("mousemove", debouncedHandleWindowPointerMove as EventListener);
      }
    });

    onUnmounted(() => {
      if (props.useWindowMoveEvents) {
        window.removeEventListener("mouseup", handleWindowPointerUp);
        window.removeEventListener("mousemove", debouncedHandleWindowPointerMove as EventListener);
      }
    });

    // --- Expose methods for parent ---
    expose({
      updateBrush,
      reset,
      getState: () => ({ ...state }),
    });

    // --- Render ---
    return () => {
      const { start, end, brushingType } = state;
      const stageWidth = props.width;
      const stageHeight = props.height;

      const handleMap = handles();
      const cornerMap = corners();
      const width = getBrushWidth();
      const height = getBrushHeight();
      const resizeTriggerAreaSet = new Set(props.resizeTriggerAreas);

      return (
        <Group className="visx-brush" top={props.top} left={props.left}>
          {props.disableDraggingOverlay ? (
            <BrushOverlay
              width={stageWidth}
              height={stageHeight}
              onClick={(event: PointerEvent) => {
                const duration = mouseUpTime - mouseDownTime;
                if (props.onClick && duration < props.clickSensitivity) props.onClick(event);
              }}
              style={{ cursor: "default" }}
            />
          ) : (
            <Drag
              width={stageWidth}
              height={stageHeight}
              resetOnStart
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              isDragging={props.useWindowMoveEvents ? brushingType === "select" : undefined}
            >
              {{
                default: ({
                  dragStart,
                  isDragging,
                  dragMove,
                  dragEnd,
                }: {
                  dragStart: (e: any) => void;
                  isDragging: boolean;
                  dragMove: (e: any) => void;
                  dragEnd: (e: any) => void;
                }) => (
                  <BrushOverlay
                    width={stageWidth}
                    height={stageHeight}
                    onDoubleClick={() => reset()}
                    onClick={(event: PointerEvent) => {
                      const duration = mouseUpTime - mouseDownTime;
                      if (props.onClick && duration < props.clickSensitivity) props.onClick(event);
                    }}
                    onPointerDown={(event: PointerEvent) => {
                      mouseDownTime = Date.now();
                      dragStart(event);
                    }}
                    onPointerLeave={(event: PointerEvent) => {
                      if (props.onMouseLeave) props.onMouseLeave(event);
                    }}
                    onPointerMove={(event: PointerEvent) => {
                      if (!isDragging && props.onMouseMove) props.onMouseMove(event);
                      if (isDragging) dragMove(event);
                    }}
                    onPointerUp={(event: PointerEvent) => {
                      mouseUpTime = Date.now();
                      if (props.onMouseUp) props.onMouseUp(event);
                      dragEnd(event);
                    }}
                    style={{ cursor: "crosshair" }}
                  />
                ),
              }}
            </Drag>
          )}

          {/* selection */}
          {start && end && (
            <BrushSelection
              updateBrush={updateBrush}
              width={width}
              height={height}
              stageWidth={stageWidth}
              stageHeight={stageHeight}
              brush={{ ...state }}
              disableDraggingSelection={props.disableDraggingSelection}
              onBrushEnd={props.onBrushEnd}
              onBrushStart={handleBrushStart}
              onMouseLeave={props.onMouseLeave}
              onMouseMove={props.onMouseMove}
              onMouseUp={props.onMouseUp}
              onMoveSelectionChange={handleBrushingTypeChange}
              onClick={props.onClick}
              selectedBoxStyle={props.selectedBoxStyle}
              isControlled={props.useWindowMoveEvents}
              isDragInProgress={props.useWindowMoveEvents ? brushingType === "move" : undefined}
            />
          )}

          {/* handles */}
          {start &&
            end &&
            (Object.keys(handleMap) as ResizeTriggerAreas[])
              .filter((handleKey) => resizeTriggerAreaSet.has(handleKey))
              .map((handleKey) => {
                const handle = handleMap[handleKey];
                return (
                  handle && (
                    <BrushHandle
                      key={`handle-${handleKey}`}
                      type={handleKey}
                      handle={handle}
                      stageWidth={stageWidth}
                      stageHeight={stageHeight}
                      updateBrush={updateBrush}
                      brush={{ ...state }}
                      onBrushStart={handleBrushStart}
                      onBrushEnd={props.onBrushEnd}
                      isControlled={props.useWindowMoveEvents}
                      isDragInProgress={
                        props.useWindowMoveEvents ? brushingType === handleKey : undefined
                      }
                      onBrushHandleChange={handleBrushingTypeChange}
                      renderBrushHandle={props.renderBrushHandle}
                    />
                  )
                );
              })}

          {/* corners */}
          {start &&
            end &&
            (Object.keys(cornerMap) as ResizeTriggerAreas[])
              .filter((cornerKey) => resizeTriggerAreaSet.has(cornerKey))
              .map((cornerKey) => {
                const corner = cornerMap[cornerKey];
                return (
                  corner && (
                    <BrushCorner
                      key={`corner-${cornerKey}`}
                      type={cornerKey}
                      brush={{ ...state }}
                      updateBrush={updateBrush}
                      stageWidth={stageWidth}
                      stageHeight={stageHeight}
                      corner={corner}
                      onBrushEnd={props.onBrushEnd}
                    />
                  )
                );
              })}
        </Group>
      );
    };
  },
});

export default BaseBrush;
