import "../src/static/css/index.css";
import {
    PopUp
} from "../src/static/code/components/PopUp";

export default {
    title: "PopUp",
};

const Template = ({
        popupWidth,
        popupMinWidth,
        popupHeight,
        overlay
    }) =>
    `<pop-up style="--popup-width: ${popupWidth}; --popup-min-width: ${popupMinWidth}; --popup-height: ${popupHeight};" ${
        overlay ? "overlay" : ""
    }></pop-up>`;

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
    const popup = document.querySelector("pop-up");
    if (!e.isTrusted && popup) {
        popup.show();
    }
});