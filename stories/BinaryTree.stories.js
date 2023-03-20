import "../src/static/css/index.css";
import { BinaryTree } from "../src/static/js/components/BinaryTree";

export default {
    title: "BinaryTree",
};

const Template = ({ popupWidth, popupMinWidth, popupHeight, overlay }) =>
    `<binary-tree style="--popup-width: ${popupWidth}; --popup-min-width: ${popupMinWidth}; --popup-height: ${popupHeight};" ${
        overlay ? "overlay" : ""
    }></binary-tree>`;

export const PopUpNoOverlay = Template.bind({});
PopUpNoOverlay.args = {
    overlay: false,
    popupMinWidth: "20%",
    popupWidth: "50%",
    popupHeight: "50%",
};

export const PopUpOverlay = Template.bind({});
PopUpOverlay.args = {
    overlay: true,
    popupMinWidth: "30%",
    popupWidth: "60%",
    popupHeight: "60%",
};

document.addEventListener("DOMContentLoaded", (e) => {
    const popup = document.querySelector("binary-tree");
    if (!e.isTrusted && popup) {
    }
});
