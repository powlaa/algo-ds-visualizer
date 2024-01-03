import "../src/static/css/index.css";
import {
    ProgressBar
} from "../src/static/code/components/ProgressBar";
import {
    action
} from "@storybook/addon-actions";

export default {
    title: "ProgressBar",
};

const Template = ({
    totalSteps,
    locked
}) => `<progress-bar ${locked ? "locked" : ""} total-steps="${totalSteps}"></progress-bar>`;

export const ProgressBarActive = Template.bind({});
ProgressBarActive.args = {
    totalSteps: 15,
    locked: false,
};
export const ProgressBarLocked = Template.bind({});
ProgressBarLocked.args = {
    totalSteps: 15,
    locked: true,
};

document.addEventListener("DOMContentLoaded", (e) => {
    const progressBar = document.querySelector("progress-bar");
    if (!e.isTrusted && progressBar) {
        progressBar.addEventListener("update-step", (e) => action("update-step")(e.detail));
    }
});