import { Position, usePosition } from "./usePosition"
import React, { ComponentProps, memo } from "react"

export interface HandleProps extends ComponentProps<"circle"> {
    index: number
    handleRadius: number
    handleColor: string
    hover: boolean
    down: boolean
    background: string
    handleStroke: number
    xval: number
    yval: number
    position: Position
}

export const Handle: React.FC<HandleProps> = memo(function Handle({
    index,
    handleRadius,
    handleColor,
    hover,
    down,
    background,
    handleStroke,
    xval,
    yval,
    position,
    ...props
}) {
    const { x, y } = usePosition(position)

    const sx = x(index)
    const sy = y(index)
    const cx = x(xval)
    const cy = y(yval)
    const a = Math.atan2(cy - sy, cx - sx)
    const cxs = cx - handleRadius * Math.cos(a)
    const cys = cy - handleRadius * Math.sin(a)

    return (
        <g>
            <line
                stroke={handleColor}
                strokeWidth={hover || down ? 1 + handleStroke : handleStroke}
                x1={cxs}
                y1={cys}
                x2={sx}
                y2={sy}
            />
            <circle
                cx={cx}
                cy={cy}
                r={handleRadius}
                stroke={handleColor}
                strokeWidth={hover || down ? 2 * handleStroke : handleStroke}
                fill={down ? background : handleColor}
                {...props}
            />
        </g>
    )
})
