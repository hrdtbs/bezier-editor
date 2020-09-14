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
