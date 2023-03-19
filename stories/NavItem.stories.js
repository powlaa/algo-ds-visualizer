import "../src/static/css/index.css";
import { NavItem } from "../src/static/js/components/NavItem";
import Heapsort from "../src/static/img/heapsort.png";

export default {
    title: "NavItem",
};

const Template = ({ title, img }) => `<nav-item img="${img}" title="${title}"></nav-item>`;

export const RegularNavItem = Template.bind({});
RegularNavItem.args = {
    title: "Title",
    img: Heapsort,
};
