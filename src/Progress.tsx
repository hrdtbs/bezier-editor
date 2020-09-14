import { BezierEditorValue } from "./BezierEditor"
import { Position, usePosition } from "./usePosition"
import { bezier } from "./bezier-easing"
import React, { memo, useMemo } from "react"

interface ProgressProps {
    value: BezierEditorValue
    progress: number
    color: string
    position: Position
}

export const Progress: React.FC<ProgressProps> = memo(function Progress({
    value,
    progress,
    color,
    position,
}) {
    const { x, y } = usePosition(position)
    const easing = useMemo(() => {
        return bezier(...value)
    }, [value])

    if (!progress) return <path />
    const sx = x(0)
    const sy = y(0)
    const px = x(progress)
    const py = y(easing ? easing(progress) : 0)
    const prog = `M${px},${sy} L${px},${py} L${sx},${py}`
    return <path fill="none" strokeWidth="1px" stroke={color} d={prog} />
})
