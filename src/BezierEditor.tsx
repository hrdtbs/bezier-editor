import { Curve } from "./Curve"
import { Grid } from "./Grid"
import { Handle } from "./Handle"
import { Progress } from "./Progress"
import React, { useCallback, useMemo, useRef, useState } from "react"

export type BezierEditorValue = [number, number, number, number]
export interface BezierEditorProps {
    defaultValue?: BezierEditorValue
    value?: BezierEditorValue
    onChange?: (value: BezierEditorValue) => void
    width?: number
    height?: number
    handleRadius?: number
    style?: React.CSSProperties
    progress?: number
    handleStroke?: number
    background?: string
    gridColor?: string
    curveColor?: string
    curveWidth?: number
    handleColor?: string
    color?: string
    textStyle?: React.CSSProperties
    progressColor?: string
    readOnly?: boolean
    className?: string
    xAxisLabel?: string
    yAxisLabel?: string
}

const defaultTextStyle = {
    fontFamily: "sans-serif",
    fontSize: "10px",
}

export const BezierEditor: React.FC<BezierEditorProps> = ({
    defaultValue = [0.25, 0.25, 0.75, 0.75],
    value: valueProp,
    width = 300,
    height = 300,
    progress = 0,
    background = "#fff",
    gridColor = "#eee",
    curveColor = "#333",
    progressColor = "#ccc",
    handleColor = "#F57D7C",
    curveWidth = 2,
    handleRadius = 5,
    handleStroke = 2,
    textStyle = defaultTextStyle,
    onChange: onChangeProp,
    style,
    readOnly,
    className,
    children,
    xAxisLabel,
    yAxisLabel,
}) => {
    const [value, setValue] = useState(valueProp || defaultValue)

    const onChange = useCallback(
        (value: BezierEditorValue) => {
            setValue(value)
            if (onChangeProp) {
                onChangeProp(value)
            }
        },
        [onChangeProp]
    )

    const rootRef = useRef<SVGSVGElement>(null)

    const [xAxisLabelHeight, setXAxisLabelHeight] = useState(0)
    const xAxisLabelRef = useCallback((instance: SVGTextElement | null) => {
        if (instance) {
            setXAxisLabelHeight(instance.getBBox().height + 6)
        }
    }, [])
    const [yAxisLabelHeight, setYAxisLabelHeight] = useState(0)
    const yAxisLabelRef = useCallback((instance: SVGTextElement | null) => {
        if (instance) {
            setYAxisLabelHeight(instance.getBBox().height + 6)
        }
    }, [])
    const padding = useMemo(
        () => [0, 0, 0 + xAxisLabelHeight, 0 + yAxisLabelHeight],
        [xAxisLabelHeight, yAxisLabelHeight]
    )
    const [x, y, inversex, inversey] = useMemo(() => {
        const w = width - padding[1] - padding[3]
        const h = height - padding[0] - padding[2]
        const clampMargin = 2 * handleRadius
        return [
            (value: number) => Math.round(padding[3] + value * w),
            (value: number) => Math.round(padding[0] + (1 - value) * h),
            (x: number) => Math.max(0, Math.min((x - padding[3]) / w, 1)),
            (y: number) => {
                y = Math.max(clampMargin, Math.min(y, height - clampMargin))
                return 1 - (y - padding[0]) / h
            },
        ]
    }, [handleRadius, height, padding, width])

    const [down, setDown] = useState(0)
    const [hover, setHover] = useState(0)

    const position = useMemo(
        () => ({
            x: {
                from: x(0),
                to: x(1),
            },
            y: {
                from: y(0),
                to: y(1),
            },
        }),
        [x, y]
    )
    /**
     * Container Events
     */
    const onDownMove = useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault()
            const i = 2 * (down - 1)
            const copy = value.concat() as typeof value
            const rect = rootRef.current!.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            copy[i] = inversex(x)
            copy[i + 1] = inversey(y)
            if (onChange) {
                onChange(copy)
            }
        },
        [down, inversex, inversey, onChange, value]
    )
    const onDownLeave = useCallback(
        (e: React.MouseEvent) => {
            onDownMove(e)
            setDown(0)
        },
        [onDownMove]
    )
    const onDownUp = useCallback(() => {
        setDown(0)
    }, [])
    const containerEvents = useMemo(() => {
        return readOnly || !down
            ? {}
            : {
                  onMouseMove: onDownMove,
                  onMouseUp: onDownUp,
                  onMouseLeave: onDownLeave,
              }
    }, [down, onDownLeave, onDownMove, onDownUp, readOnly])
    /**
     * Handle1 Events
     */
    const onLeaveHandle = useCallback(() => {
        setHover(0)
    }, [])
    const onEnterHandle1 = useCallback(() => {
        setHover(1)
    }, [])
    const onDownHandle1 = useCallback((event: React.MouseEvent) => {
        event.preventDefault()
        setHover(0)
        setDown(1)
    }, [])
    const handle1Events = useMemo(() => {
        return readOnly || down
            ? {}
            : {
                  onMouseDown: onDownHandle1,
                  onMouseEnter: onEnterHandle1,
                  onMouseLeave: onLeaveHandle,
              }
    }, [down, onDownHandle1, onEnterHandle1, onLeaveHandle, readOnly])
    /**
     * Handle2 Events
     */
    const onEnterHandle2 = useCallback(() => {
        setHover(2)
    }, [])
    const onDownHandle2 = useCallback((event: React.MouseEvent) => {
        event.preventDefault()
        setHover(0)
        setDown(2)
    }, [])
    const handle2Events = useMemo(() => {
        return readOnly || down
            ? {}
            : {
                  onMouseDown: onDownHandle2,
                  onMouseEnter: onEnterHandle2,
                  onMouseLeave: onLeaveHandle,
              }
    }, [down, onDownHandle2, onEnterHandle2, onLeaveHandle, readOnly])

    const gridTextStyle = useMemo(
        () => ({
            ...defaultTextStyle,
            ...textStyle,
        }),
        [textStyle]
    )
    return (
        <svg
            ref={rootRef}
            className={className}
            style={{
                background,
                cursor: down ? "none" : hover ? "pointer" : "default",
                userSelect: "none",
                ...style,
            }}
            width={width}
            height={height}
            {...containerEvents}
        >
            <Grid
                position={position}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                background={background}
                color={gridColor}
                textStyle={gridTextStyle}
                xAxisLabelRef={xAxisLabelRef}
                yAxisLabelRef={yAxisLabelRef}
            />
            <Progress
                position={position}
                value={value}
                progress={progress}
                color={progressColor}
            />
            <Curve
                position={position}
                value={value}
                color={curveColor}
                width={curveWidth}
            />
            {children}
            {readOnly ? undefined : (
                <g>
                    <Handle
                        position={position}
                        {...handle1Events}
                        index={0}
                        xval={value[0]}
                        yval={value[1]}
                        handleRadius={handleRadius}
                        handleColor={handleColor}
                        down={down === 1}
                        hover={hover === 1}
                        handleStroke={handleStroke}
                        background={background}
                    />
                    <Handle
                        position={position}
                        {...handle2Events}
                        index={1}
                        xval={value[2]}
                        yval={value[3]}
                        handleRadius={handleRadius}
                        handleColor={handleColor}
                        down={down === 2}
                        hover={hover === 2}
                        handleStroke={handleStroke}
                        background={background}
                    />
                </g>
            )}
        </svg>
    )
}
