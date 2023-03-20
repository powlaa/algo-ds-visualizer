import { LinkedList } from "../src/static/js/components/LinkedList";
import CenterIcon from "../src/static/img/center-icon.png";

export default {
    title: "Vis/LinkedList",
};

const Template = ({ centerIcon }) => `<linked-list center-icon="${centerIcon}"></linked-list>`;

export const LinkedListRegular = Template.bind({});
LinkedListRegular.args = {
    centerIcon: CenterIcon,
};

document.addEventListener("DOMContentLoaded", (e) => {
    const linkedList = document.querySelector("linked-list");
    if (!e.isTrusted && linkedList) {
        linkedList.data = [
            { id: 0, data: "15" },
            { id: 1, data: "22" },
            { id: 2, data: "23" },
        ];
        linkedList.updateLinkedList();
    }
});
