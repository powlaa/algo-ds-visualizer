import "../src/static/css/index.css";
import {
    ControlPanel
} from "../src/static/code/components/ControlPanel";
import {
    action
} from "@storybook/addon-actions";

export default {
    title: "ControlPanel",
};

const Template = ({}) => `<control-panel></control-panel>`;

export const RegularControlPanel = Template.bind({});

document.addEventListener("DOMContentLoaded", (e) => {
    const controlPanel = document.querySelector("control-panel");
    document.querySelector("#root").style.height = "100%";
    if (!e.isTrusted && controlPanel) {
        controlPanel.data = [{
                name: "add",
                parameters: [{
                        name: "index",
                        type: "number",
                        min: 0
                    },
                    {
                        name: "data",
                        type: "text"
                    },
                ],
            },
            {
                name: "delete",
                parameters: [{
                    name: "data",
                    type: "text"
                }],
            },
            {
                name: "contains",
                parameters: [{
                    name: "data",
                    type: "text"
                }],
            },
            {
                name: "get",
                parameters: [{
                    name: "index",
                    type: "number",
                    min: 0
                }],
            },
        ];
        controlPanel.addEventListener("call-method", (e) => action("call-method")(e.detail));
    }
});