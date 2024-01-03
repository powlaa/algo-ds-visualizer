import "../src/static/css/index.css";
import {
    NavItem
} from "../src/static/code/components/NavItem";
import Heapsort from "../src/static/img/heapsort.png";

export default {
    title: "NavItem",
};

const Template = ({
    title,
    img,
    link
}) => `<nav-item img="${img}" link="${link}" title="${title}"></nav-item>`;

export const RegularNavItem = Template.bind({});
RegularNavItem.args = {
    title: "Title",
    img: Heapsort,
    link: "/",
};