import "../src/static/css/index.css";
import {
    Header
} from "../src/static/code/components/Header";
import {
    PopUp
} from "../src/static/code/components/PopUp";
import CodeIcon from "../src/static/img/code-icon.png";
import HomeIcon from "../src/static/img/homepage-icon.png";
import InformationIcon from "../src/static/img/information-mark.png";
import {
    action
} from "@storybook/addon-actions";

export default {
    title: "Header",
};

const Template = ({
        title,
        titleBig,
        heading,
        description,
        arrayInput,
        startBtnName,
        codeIcon,
        homeIcon,
        informationIcon,
        headerBackgroundColor,
        headerColor,
    }) =>
    `<header-element style="${`--header-background-color: ${headerBackgroundColor}; --header-color: ${headerColor}`}" title="${title}"  ${
        titleBig ? "title-big" : ""
    } heading="${heading}" description="${description}" ${
        arrayInput ? "array-input" : ""
    } start-btn-name="${startBtnName}" code-icon="${codeIcon}" home-icon="${homeIcon}" information-icon="${informationIcon}"></header-element>`;

export const VisHeader = Template.bind({});
VisHeader.args = {
    title: "Header",
    heading: "This is the explanation heading",
    description: "This is the explanation description",
    startBtnName: "Start",
    codeIcon: CodeIcon,
    homeIcon: HomeIcon,
    informationIcon: InformationIcon,
    headerBackgroundColor: "#ced0c1",
    hederColor: "#000000",
};

export const VisHeaderSort = Template.bind({});
VisHeaderSort.args = {
    title: "Header",
    heading: "This is the explanation heading",
    description: "This is the explanation description",
    arrayInput: true,
    startBtnName: "Sort",
    codeIcon: CodeIcon,
    homeIcon: HomeIcon,
    informationIcon: InformationIcon,
    headerBackgroundColor: "#ced0c1",
    hederColor: "#000000",
};

export const TitleHeader = Template.bind({});
TitleHeader.args = {
    title: "Header with big title",
    titleBig: true,
    headerBackgroundColor: "#ced0c1",
    hederColor: "#000000",
};

document.addEventListener("DOMContentLoaded", (e) => {
    const header = document.querySelector("header-element");
    if (!e.isTrusted && header) {
        header.addEventListener("start", (e) => action("start")(e.detail));
        header.addEventListener("code", (e) => action("code")(e.detail));
    }
});