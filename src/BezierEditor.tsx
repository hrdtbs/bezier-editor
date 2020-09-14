import { Curve } from "./Curve"
import { Grid } from "./Grid"
import { Handle } from "./Handle"
import { Progress } from "./Progress"
import React, { useCallback, useRef, useState } from "react"

export interface BezierEditorProps {
    value: [number, number, number, number]
    onChange: (value: [number, number, number, number]) => void
    width: number
    height: number
    handleRadius: number
    style: React.CSSProperties
    progress: number
    handleStroke: number
    background: string
    gridColor: string
    curveColor: string
    curveWidth: number
    handleColor: string
    color: string
    textStyle: React.CSSProperties
    progressColor: string
    readOnly: boolean
    className: string
    xAxisLabel?: string
    yAxisLabel?: string
}

const defaultTextStyle = {
    fontFamily: "sans-serif",
    fontSize: "10px",
}

const defaultPointers = {
    down: "none",
    hover: "pointer",
    def: "default",
}

export const BezierEditor: React.FC<BezierEditorProps> = ({
    value = [0.25, 0.25, 0.75, 0.75],
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
    onChange,
    style,
    readOnly,
    className,
    children,
    xAxisLabel,
    yAxisLabel,
}) => {
    const pointers = defaultPointers
    const padding = [0, 0, xAxisLabel ? 20 : 0, yAxisLabel ? 20 : 0]

    const [down, setDown] = useState<number | null>(0)
    const [hover, setHover] = useState<number | null>(0)

    const makeEnterHandler = useCallback(
        (value: number) => {
            return () => {
                if (!down) {
                    setHover(value)
                }
            }
        },
        [down]
    )
    const onEnterHandle1 = makeEnterHandler(1)
    const onEnterHandle2 = makeEnterHandler(2)

    const makeLeaveHandler = useCallback(() => {
        return () => {
            if (!down) {
                setHover(null)
            }
        }
    }, [down])

    const onLeaveHandle1 = makeLeaveHandler()
    const onLeaveHandle2 = makeLeaveHandler()

    const makeDownHander = useCallback((value: number) => {
        return (event: React.MouseEvent) => {
            event.preventDefault()
            setHover(null)
            setDown(value)
        }
    }, [])

    const onDownHandle1 = makeDownHander(1)
    const onDownHandle2 = makeDownHander(2)

    const ref = useRef<SVGSVGElement>(null)

    const positionForEvent = (e: React.MouseEvent) => {
        const rect = ref.current!.getBoundingClientRect()
        return [e.clientX - rect.left, e.clientY - rect.top]
    }
    const x = (value: number) => {
        const w = width - padding[1] - padding[3]
        return Math.round(padding[3] + value * w)
    }

    const inversex = (x: number) => {
        const w = width - padding[1] - padding[3]
        return Math.max(0, Math.min((x - padding[3]) / w, 1))
    }

    const y = (value: number) => {
        const h = height - padding[0] - padding[2]
        return Math.round(padding[0] + (1 - value) * h)
    }

    const inversey = (y: number) => {
        const clampMargin = 2 * handleRadius
        const h = height - padding[0] - padding[2]
        y = Math.max(clampMargin, Math.min(y, height - clampMargin))
        return 1 - (y - padding[0]) / h
    }

    const onDownMove = (e: React.MouseEvent) => {
        if (down) {
            e.preventDefault()
            const i = 2 * (down - 1)
            const copy = value.concat() as typeof value
            const [x, y] = positionForEvent(e)
            copy[i] = inversex(x)
            copy[i + 1] = inversey(y)
            onChange(copy)
        }
    }

    const onDownLeave = (e: React.MouseEvent) => {
        if (down) {
            onDownMove(e)
            setDown(null)
        }
    }
    const onDownUp = () => {
        setDown(0)
    }

    const sharedProps = {
        position: {
            x: {
                from: x(0),
                to: x(1),
            },
            y: {
                from: y(0),
                to: y(1),
            },
        },
    }

    const cursor = { ...defaultPointers, ...pointers }

    const styles: React.CSSProperties = {
        background,
        cursor: down ? cursor.down : hover ? cursor.hover : cursor.def,
        userSelect: "none",
        ...style,
    }

    const containerEvents =
        readOnly || !down
            ? {}
            : {
                  onMouseMove: onDownMove,
                  onMouseUp: onDownUp,
                  onMouseLeave: onDownLeave,
              }
    const handle1Events =
        readOnly || down
            ? {}
            : {
                  onMouseDown: onDownHandle1,
                  onMouseEnter: onEnterHandle1,
                  onMouseLeave: onLeaveHandle1,
              }
    const handle2Events =
        readOnly || down
            ? {}
            : {
                  onMouseDown: onDownHandle2,
                  onMouseEnter: onEnterHandle2,
                  onMouseLeave: onLeaveHandle2,
              }

    return (
        <svg
            ref={ref}
            className={className}
            style={styles}
            width={width}
            height={height}
            {...containerEvents}
        >
            <Grid
                {...sharedProps}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                background={background}
                color={gridColor}
                textStyle={{
                    ...defaultTextStyle,
                    ...textStyle,
                }}
            />
            <Progress
                {...sharedProps}
                value={value}
                progress={progress}
                color={progressColor}
            />
            <Curve
                {...sharedProps}
                value={value}
                color={curveColor}
                width={curveWidth}
            />
            {children}
            {readOnly ? undefined : (
                <g>
                    <Handle
                        {...sharedProps}
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
                        {...sharedProps}
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
