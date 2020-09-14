import { Position, usePosition } from "./usePosition"
import React, { useMemo } from "react"

interface CurveProps {
    color: string
    width: React.ReactText
    value: number[]
    position: Position
}

export const Curve: React.FC<CurveProps> = ({
    color,
    width,
    value,
    position,
}) => {
    const { x, y } = usePosition(position)

    const curve = useMemo(() => {
        const sx = x(0)
        const sy = y(0)
        const ex = x(1)
        const ey = y(1)
        const cx1 = x(value[0])
        const cy1 = y(value[1])
        const cx2 = x(value[2])
        const cy2 = y(value[3])
        return `M${sx},${sy} C${cx1},${cy1} ${cx2},${cy2} ${ex},${ey}`
    }, [value, x, y])

    return <path fill="none" stroke={color} strokeWidth={width} d={curve} />
}
