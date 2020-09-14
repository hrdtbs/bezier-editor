import { css } from "@emotion/core"
import React from "react"

export interface ButtonProps {}

export const Button: React.FC<ButtonProps> = ({ children }) => {
    return (
        <div
            css={css`
                background-color: coral;
            `}
        >
            <button type="button">{children}</button>
        </div>
    )
}
