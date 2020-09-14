import React, { useEffect, useState } from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from "@storybook/react/types-6-0"

import { BezierEditor, BezierEditorProps } from "./BezierEditor"

export default {
    title: "Example/BezierEditor",
    component: BezierEditor,
    argTypes: {},
} as Meta

const Template: Story<BezierEditorProps> = (args) => {
    const [value, setValue] = useState<[number, number, number, number]>([
        0.2,
        0.2,
        0.8,
        0.8,
    ])
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        window.setInterval(() => {
            setProgress((prev) => (prev >= 1 ? 0 : prev + 0.1))
        }, 100)
    }, [])
    return (
        <BezierEditor
            {...args}
            value={value}
            onChange={(v) => setValue(v)}
            progress={progress}
        />
    )
}

export const Primary = Template.bind({})
Primary.args = {}
