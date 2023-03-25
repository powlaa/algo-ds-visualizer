import { VisContainer } from "../src/static/js/components/VisContainer";
import { PopUp } from "../src/static/js/components/PopUp";
import CodeIcon from "../src/static/img/code-icon.png";
import HomeIcon from "../src/static/img/homepage-icon.png";
import InformationIcon from "../src/static/img/information-mark.png";
import { action } from "@storybook/addon-actions";

export default {
    title: "VisContainer",
};

const Template = ({ title, locked, arrayInput, startBtnName, codeIcon, homeIcon, informationIcon, headerBackgroundColor, headerColor }) =>
    `<vis-container
        style="${`--header-background-color: ${headerBackgroundColor}; --header-color: ${headerColor}`}"
        title="${title}"
        ${locked ? "locked" : ""}
        ${arrayInput ? "array-input" : ""}
        start-btn-name="${startBtnName}"
        code-icon="${codeIcon}"
        home-icon="${homeIcon}"
        information-icon="${informationIcon}"
    ></vis-container>`;

export const VisContainerStart = Template.bind({});
VisContainerStart.args = {
    title: "Title",
    startBtnName: "Start",
    locked: false,
    arrayInput: false,
    codeIcon: CodeIcon,
    homeIcon: HomeIcon,
    informationIcon: InformationIcon,
    headerBackgroundColor: "#ced0c1",
    hederColor: "#000000",
};

export const VisContainerArrayInput = Template.bind({});
VisContainerArrayInput.args = {
    title: "Title",
    startBtnName: "Sort",
    locked: false,
    arrayInput: true,
    codeIcon: CodeIcon,
    homeIcon: HomeIcon,
    informationIcon: InformationIcon,
    headerBackgroundColor: "#ced0c1",
    hederColor: "#000000",
};

export const VisContainerLocked = Template.bind({});
VisContainerLocked.args = {
    title: "Title",
    startBtnName: "Sort",
    locked: true,
    arrayInput: true,
    codeIcon: CodeIcon,
    homeIcon: HomeIcon,
    informationIcon: InformationIcon,
    headerBackgroundColor: "#ced0c1",
    hederColor: "#000000",
};

document.addEventListener("DOMContentLoaded", (e) => {
    const visContainer = document.querySelector("vis-container");
    if (!e.isTrusted && visContainer) {
        visContainer.addEventListener("show-step", (e) => action("show-step")(e.detail));
        visContainer.addEventListener("start", (e) => action("start")(e.detail));
        visContainer.addEventListener("code", (e) => action("code")(e.detail));
    }
});
