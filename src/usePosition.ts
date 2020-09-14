const interp = (a: number, b: number, x: number) => {
    return a * (1 - x) + b * x
}

export interface Position {
    x: {
        from: number
        to: number
    }
    y: {
        from: number
        to: number
    }
}

export const usePosition = (p: Position) => {
    return {
        x: (value: number) => Math.round(interp(p.x.from, p.x.to, value)),
        y: (value: number) => Math.round(interp(p.y.from, p.y.to, value)),
    }
}
