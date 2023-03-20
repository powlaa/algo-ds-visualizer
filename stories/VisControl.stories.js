import "../src/static/css/index.css";
import { VisControl } from "../src/static/js/components/VisControl";
import CenterIcon from "../src/static/img/center-icon.png";
import DeleteIcon from "../src/static/img/delete-icon.png";
import HelpIcon from "../src/static/img/question-mark.png";
import { action } from "@storybook/addon-actions";

export default {
    title: "VisControl",
};

const Template = ({ help, del, deleteIcon, helpIcon, centerIcon }) =>
    `<vis-control center-icon="${centerIcon}" help-icon="${helpIcon}" delete-icon="${deleteIcon}" ${del ? "del" : ""} ${
        help ? "help" : ""
    }></vis-control>`;

export const CenterVisControl = Template.bind({});
CenterVisControl.args = {
    centerIcon: CenterIcon,
};

export const HelpVisControl = Template.bind({});
HelpVisControl.args = {
    centerIcon: CenterIcon,
    help: true,
    helpIcon: HelpIcon,
};

export const DeleteVisControl = Template.bind({});
DeleteVisControl.args = {
    centerIcon: CenterIcon,
    del: true,
    deleteIcon: DeleteIcon,
};
export const HelpDeleteVisControl = Template.bind({});
HelpDeleteVisControl.args = {
    centerIcon: CenterIcon,
    del: true,
    help: true,
    deleteIcon: DeleteIcon,
    helpIcon: HelpIcon,
};

document.addEventListener("DOMContentLoaded", (e) => {
    const visControl = document.querySelector("vis-control");
    if (!e.isTrusted && visControl) {
        visControl.addEventListener("delete", (e) => action("delete")(e.detail));
        visControl.addEventListener("center", (e) => action("center")(e.detail));
        visControl.addEventListener("help", (e) => action("help")(e.detail));
    }
});
