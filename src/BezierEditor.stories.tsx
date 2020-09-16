import React from "react"
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta, Story } from "@storybook/react/types-6-0"

import { BezierEditor, BezierEditorProps } from "./BezierEditor"

export default {
    title: "Example/BezierEditor",
    component: BezierEditor,
    argTypes: {},
} as Meta

const Template: Story<BezierEditorProps> = (args) => <BezierEditor {...args} />

export const BasicUsage = Template.bind({})

export const WithLabels = Template.bind({})

WithLabels.args = {
    xAxisLabel: "Time Percentage",
    yAxisLabel: "Progress Percentage",
}

export const ReadOnly = Template.bind({})

ReadOnly.args = {
    readOnly: true,
    defaultValue: [0.8, 0.2, 0.2, 0.8],
}

export const WithProgress = Template.bind({})

WithProgress.args = {
    progress: 0.42,
    progressColor: "coral",
    defaultValue: [0.8, 0.2, 0.2, 0.8],
}
