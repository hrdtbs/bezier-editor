import { Position, usePosition } from "./usePosition"
import React from "react"

const range = (from: number, to: number, step: number) => {
    const t = []
    for (let i = from; i < to; i += step) t.push(i)
    return t
}

export interface GridProps {
    background: string
    color: string
    textStyle: React.CSSProperties
    position: Position
}

export const Grid: React.FC<GridProps> = ({
    background,
    color,
    textStyle,
    position,
}) => {
    const { x, y } = usePosition(position)
    const sx = x(0)
    const sy = y(0)
    const ex = x(1)
    const ey = y(1)

    const gridX = (div: number) => {
        const step = 1 / div
        return range(0, 1, step).map(x)
    }

    const gridY = (div: number) => {
        const step = 1 / div
        return range(0, 1, step).map(y)
    }

    const xhalf = gridX(2)
    const yhalf = gridY(2)
    const xtenth = gridX(10)
    const ytenth = gridY(10)

    const gridbg = `M${sx},${sy} L${sx},${ey} L${ex},${ey} L${ex},${sy} Z`

    const tenth = xtenth
        .map((xp) => `M${xp},${sy} L${xp},${ey}`)
        .concat(ytenth.map((yp) => `M${sx},${yp} L${ex},${yp}`))
        .join(" ")

    const half = xhalf
        .map((xp) => `M${xp},${sy} L${xp},${ey}`)
        .concat(yhalf.map((yp) => `M${sx},${yp} L${ex},${yp}`))
        .concat([`M${sx},${sy} L${ex},${ey}`])
        .join(" ")

    const ticksLeft = ytenth
        .map((yp, i) => {
            const w = 3 + (i % 5 === 0 ? 2 : 0)
            return `M${sx},${yp} L${sx - w},${yp}`
        })
        .join(" ")

    const ticksBottom = xtenth
        .map((xp, i) => {
            const h = 3 + (i % 5 === 0 ? 2 : 0)
            return `M${xp},${sy} L${xp},${sy + h}`
        })
        .join(" ")
    return (
        <g>
            <path fill={background} d={gridbg} />
            <path strokeWidth="1px" stroke={color} d={tenth} />
            <path strokeWidth="2px" stroke={color} d={half} />
            <path strokeWidth="1px" stroke={color} d={ticksLeft} />
            <text
                style={{ textAnchor: "end", ...textStyle }}
                transform="rotate(-90)"
                x={-y(1)}
                y={x(0) - 8}
            >
                Progress Percentage
            </text>
            <path strokeWidth="1px" stroke={color} d={ticksBottom} />
            <text
                style={{
                    dominantBaseline: "text-before-edge",
                    ...textStyle,
                }}
                textAnchor="end"
                x={x(1)}
                y={y(0) + 5}
            >
                Time Percentage
            </text>
        </g>
    )
}
