import { BinaryTree } from "../src/static/code/components/BinaryTree";
import CenterIcon from "../src/static/img/center-icon.png";

export default {
    title: "Vis/BinaryTree",
};

const Template = ({ centerIcon, nodeRadius }) => `<binary-tree center-icon="${centerIcon}" node-radius="${nodeRadius}"></binary-tree>`;

export const BinaryTreeRegular = Template.bind({});
BinaryTreeRegular.args = {
    centerIcon: CenterIcon,
    nodeRadius: 30,
};

document.addEventListener("DOMContentLoaded", (e) => {
    const binaryTree = document.querySelector("binary-tree");
    if (!e.isTrusted && binaryTree) {
        binaryTree.data = [{ value: 2 }, { value: 5 }, { value: 6 }, { value: 13 }, { value: 7 }, { value: 8 }, { value: 9 }];
    }
});
