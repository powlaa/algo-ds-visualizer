import {
    TableDisplay
} from "../src/static/code/components/TableDisplay";

export default {
    title: "Vis/TableDisplay",
};

const Template = ({
        tableBackgroundColor,
        tableColor
    }) =>
    `<table-display style="--table-background-color: ${tableBackgroundColor}; --table-color: ${tableColor};"></table-display>`;

export const TableDisplayRegular = Template.bind({});
TableDisplayRegular.args = {
    tableColor: "#ffffff",
    tableBackgroundColor: "#03a688",
};

document.addEventListener("DOMContentLoaded", (e) => {
    const tableDisplay = document.querySelector("table-display");
    if (!e.isTrusted && tableDisplay) {
        const columns = [{
                id: "steps",
                title: "Steps"
            },
            {
                id: "visited",
                title: "Q (visited)"
            },
            {
                id: "unvisited",
                title: "S (unvisited)"
            },
            {
                id: 0,
                title: "A"
            },
            {
                id: 1,
                title: "B"
            },
            {
                id: 2,
                title: "C"
            },
        ];
        let rows = [
            [{
                    row: "INIT",
                    column: "steps",
                    value: "INIT"
                },
                {
                    row: "INIT",
                    column: "visited",
                    value: "{}"
                },
                {
                    row: "INIT",
                    column: "unvisited",
                    value: "{A, B, C}"
                },
                {
                    row: "INIT",
                    column: 0,
                    value: "0<sub>A</sub>"
                },
                {
                    row: "INIT",
                    column: 1,
                    value: "∞"
                },
                {
                    row: "INIT",
                    column: 2,
                    value: "∞"
                },
            ],
        ];
        tableDisplay.showTable(columns, rows);
        rows.push(
            [{
                    row: 1,
                    column: "steps",
                    value: 1
                },
                {
                    row: 1,
                    column: "visited",
                    value: "{A}"
                },
                {
                    row: 1,
                    column: "unvisited",
                    value: "{B, C}"
                },
                {
                    row: 1,
                    column: 0,
                    value: "0<sub>A</sub>"
                },
                {
                    row: 1,
                    column: 1,
                    value: "2<sub>A</sub>"
                },
                {
                    row: 1,
                    column: 2,
                    value: "10<sub>A</sub>"
                },
            ],
            [{
                    row: 2,
                    column: "steps",
                    value: 2
                },
                {
                    row: 2,
                    column: "visited",
                    value: "{A, B}"
                },
                {
                    row: 2,
                    column: "unvisited",
                    value: "{C}"
                },
                {
                    row: 2,
                    column: 0,
                    value: "0<sub>A</sub>"
                },
                {
                    row: 2,
                    column: 1,
                    value: "2<sub>A</sub>"
                },
                {
                    row: 2,
                    column: 2,
                    value: "6<sub>B</sub>"
                },
            ],
            [{
                    row: 3,
                    column: "steps",
                    value: 3
                },
                {
                    row: 3,
                    column: "visited",
                    value: "{A, B, C}"
                },
                {
                    row: 3,
                    column: "unvisited",
                    value: "{}"
                },
                {
                    row: 3,
                    column: 0,
                    value: "0<sub>A</sub>"
                },
                {
                    row: 3,
                    column: 1,
                    value: "2<sub>A</sub>"
                },
                {
                    row: 3,
                    column: 2,
                    value: "6<sub>B</sub>"
                },
            ]
        );
        tableDisplay.updateRows(rows);
    }
});