import {
    GraphCreator
} from "../src/static/code/components/GraphCreator";
import CenterIcon from "../src/static/img/center-icon.png";
import DeleteIcon from "../src/static/img/delete-icon.png";
import HelpIcon from "../src/static/img/question-mark.png";
import {
    action
} from "@storybook/addon-actions";

export default {
    title: "Vis/GraphCreator",
};

const Template = ({
        centerIcon,
        deleteIcon,
        helpIcon
    }) =>
    `<graph-creator center-icon="${centerIcon}" delete-icon="${deleteIcon}" help-icon="${helpIcon}"></graph-creator>`;

export const GraphCreatorRegular = Template.bind({});
GraphCreatorRegular.args = {
    centerIcon: CenterIcon,
    deleteIcon: DeleteIcon,
    helpIcon: HelpIcon,
};

document.addEventListener("DOMContentLoaded", (e) => {
    const graphCreator = document.querySelector("graph-creator");
    if (!e.isTrusted && graphCreator) {
        const xLoc = graphCreator.xLoc;
        const yLoc = graphCreator.yLoc;
        const nodes = [{
                title: "A",
                id: 0,
                x: xLoc - 200,
                y: yLoc + 100
            },
            {
                title: "B",
                id: 1,
                x: xLoc,
                y: yLoc
            },
            {
                title: "C",
                id: 2,
                x: xLoc,
                y: yLoc + 200
            },
            {
                title: "D",
                id: 3,
                x: xLoc + 200,
                y: yLoc + 200
            },
            {
                title: "E",
                id: 4,
                x: xLoc + 200,
                y: yLoc
            },
            {
                title: "F",
                id: 5,
                x: xLoc + 400,
                y: yLoc + 100
            },
        ];
        const edges = [{
                source: nodes[0],
                target: nodes[1],
                weight: 5
            },
            {
                source: nodes[0],
                target: nodes[2],
                weight: 2
            },
            {
                source: nodes[1],
                target: nodes[0],
                weight: 5
            },
            {
                source: nodes[1],
                target: nodes[2],
                weight: 2
            },
            {
                source: nodes[1],
                target: nodes[4],
                weight: 2
            },
            {
                source: nodes[2],
                target: nodes[0],
                weight: 2
            },
            {
                source: nodes[2],
                target: nodes[1],
                weight: 2
            },
            {
                source: nodes[2],
                target: nodes[3],
                weight: 8
            },
            {
                source: nodes[2],
                target: nodes[4],
                weight: 3
            },
            {
                source: nodes[3],
                target: nodes[2],
                weight: 8
            },
            {
                source: nodes[3],
                target: nodes[4],
                weight: 6
            },
            {
                source: nodes[3],
                target: nodes[5],
                weight: 4
            },
            {
                source: nodes[4],
                target: nodes[1],
                weight: 2
            },
            {
                source: nodes[4],
                target: nodes[2],
                weight: 3
            },
            {
                source: nodes[4],
                target: nodes[3],
                weight: 6
            },
            {
                source: nodes[4],
                target: nodes[5],
                weight: 3
            },
            {
                source: nodes[5],
                target: nodes[3],
                weight: 4
            },
            {
                source: nodes[5],
                target: nodes[4],
                weight: 3
            },
        ];
        graphCreator.showGraph(nodes, edges, true);
        graphCreator.addEventListener("node-selected", (e) => action("node-selected")(e.detail));
        graphCreator.addEventListener("node-deselected", (e) => action("node-deselected")(e.detail));
        graphCreator.addEventListener("update-nodes", (e) => action("update-nodes")(e.detail));
        graphCreator.addEventListener("update-edges", (e) => action("update-edges")(e.detail));
        graphCreator.addEventListener("error", (e) => action("error")(e.detail));
        graphCreator.addEventListener("delete", (e) => action("delete")(e.detail));
        graphCreator.addEventListener("help", (e) => action("help")(e.detail));
    }
});