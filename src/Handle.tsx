import { Position, usePosition } from "./usePosition"
import React from "react"

export interface HandleProps {
    index: number
    handleRadius: number
    handleColor: string
    hover: boolean
    down: boolean
    background: string
    handleStroke: number
    xval: number
    yval: number
    onMouseEnter?: (
        event: React.MouseEvent<SVGCircleElement, MouseEvent>
    ) => void
    onMouseLeave?: (
        event: React.MouseEvent<SVGCircleElement, MouseEvent>
    ) => void
    onMouseDown?: (
        event: React.MouseEvent<SVGCircleElement, MouseEvent>
    ) => void
    position: Position
}

export const Handle: React.FC<HandleProps> = ({
    index,
    handleRadius,
    handleColor,
    hover,
    down,
    background,
    handleStroke,
    xval,
    yval,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    position,
}) => {
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
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={onMouseDown}
            />
        </g>
    )
}
