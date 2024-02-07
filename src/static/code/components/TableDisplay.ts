import { Selection, select } from "d3";
import { ColumnData, RowData, TableHighlight } from "../types";

export class TableDisplay extends HTMLElement {
	private _shadow: ShadowRoot;

	private _tbody: Selection<
		HTMLTableSectionElement,
		unknown,
		null,
		undefined
	> | null = null;

	constructor() {
		super();
		this._shadow = this.attachShadow({ mode: "open" });
		this._render();
	}

	public reset() {
		select(this._shadow.querySelector("#container > table")).remove();
	}

	/**
	 * Displays a table in the component.
	 * @param columnsData - An array of objects representing columns, each having a 'title' property.
	 * @param rowsData - An array of arrays of objects representing rows, each having a 'value' property.
	 */
	public showTable(columnsData: ColumnData[], rowsData?: RowData[][]) {
		// Remove previous table.
		select(this._shadow.querySelector("#container > table")).remove();
		// Append new table and thead to the container.
		const table = select(this._shadow.querySelector("#container"))
				.append("table")
				.attr("style", "margin-left: 250px"),
			thead = table.append("thead");
		this._tbody = table.append("tbody");

		// Append the header row.
		thead
			.append("tr")
			.selectAll("th")
			.data(columnsData)
			.enter()
			.append("th")
			.text((column) => column.title);

		if (!rowsData) return;

		// Create a row for each object in the data.
		const rows = this._tbody
			.selectAll("tr")
			.data(rowsData)
			.enter()
			.append("tr");

		// Create a cell in each row for each column.
		rows.selectAll("td")
			.data((d) => d)
			.enter()
			.append("td")
			.html((d) => d.value);
	}

	/**
	 * Updates the rows of the table with the option to highlight.
	 * @param rowsData - The new rows data.
	 * @param highlights - The highlights to be applied to the rows.
	 */
	public updateRows(rowsData: RowData[][], highlights?: TableHighlight[]) {
		if (!this._tbody) {
			throw new Error("Tbody is null.");
		}
		this._tbody.selectAll("tr").remove();

		// Create a row for each object in the data.
		const rows = this._tbody
			.selectAll("tr")
			.data(rowsData)
			.enter()
			.append("tr");

		// Create a cell in each row for each column.
		rows.selectAll("td")
			.data((d) => d)
			.enter()
			.append("td")
			.classed("highlight", (d) =>
				// False if highlights is undefined.
				Boolean(
					highlights?.find(
						(h) => h.row === d.row && h.column === d.column
					)
				)
			)
			.html((d) => d.value);
	}

	private _render() {
		const style = `
        <style>
            .container {
                margin: 40px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 0 !important;
            }
            table td,
            table th {
                border: 1px solid #ddd;
                padding: 4px;
            }
            table td.highlight {
                background-color: #b0e2d9;
            }

            table tr:nth-child(even) {
                background-color: #f2f2f2;
            }

            table tr:hover {
                background-color: #ddd;
            }

            table th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: var(--table-background-color, #03a688);
                color: var(--table-color, white);
            }
        </style>
	`;

		this._shadow.innerHTML =
			`<div id="container" class="container"></div>` + style;
	}
}

customElements.define("table-display", TableDisplay);
