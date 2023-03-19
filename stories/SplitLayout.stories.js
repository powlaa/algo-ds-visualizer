import { SplitLayout } from "../src/static/js/components/SplitLayout";

export default {
    title: "SplitLayout",
};

const Template = ({ splitLayoutResizerBorder, splitLayoutWidthLeft, topBottomRight, topBottomLeft }) =>
    `<split-layout style="--split-layout-resizer-border: ${splitLayoutResizerBorder}; --split-layout-initial-width-left: ${splitLayoutWidthLeft};" ${
        topBottomRight ? "top-bottom-right" : ""
    } ${topBottomLeft ? "top-bottom-left" : ""}></split-layout>`;

export const SplitLayoutLeftRight = Template.bind({});
SplitLayoutLeftRight.args = {
    topBottomRight: false,
    topBottomLeft: false,
    splitLayoutResizerBorder: "5px solid #80808036",
    splitLayoutWidthLeft: "50%",
};

export const SplitLayoutTwoLeft = Template.bind({});
SplitLayoutTwoLeft.args = {
    topBottomRight: false,
    topBottomLeft: true,
    splitLayoutResizerBorder: "2px solid #80808036",
    splitLayoutWidthLeft: "60%",
};

export const SplitLayoutTwoRight = Template.bind({});
SplitLayoutTwoRight.args = {
    topBottomRight: true,
    topBottomLeft: false,
    splitLayoutResizerBorder: "2px solid #80808036",
    splitLayoutWidthLeft: "60%",
};

export const SplitLayoutTwoLeftRight = Template.bind({});
SplitLayoutTwoLeftRight.args = {
    topBottomRight: true,
    topBottomLeft: true,
    splitLayoutResizerBorder: "2px solid #80808036",
    splitLayoutWidthLeft: "60%",
};
