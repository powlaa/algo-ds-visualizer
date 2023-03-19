class TableDisplay extends HTMLElement {
    _tbody = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    reset() {
        d3.select(this.shadowRoot.querySelector("#container > table")).remove();
    }

    showTable(columnsData, rowsData) {
        d3.select(this.shadowRoot.querySelector("#container > table")).remove();
        var table = d3.select(this.shadowRoot.querySelector("#container")).append("table").attr("style", "margin-left: 250px"),
            thead = table.append("thead");
        this._tbody = table.append("tbody");

        // append the header row
        thead
            .append("tr")
            .selectAll("th")
            .data(columnsData)
            .enter()
            .append("th")
            .text((column) => column.title);

        // create a row for each object in the data
        var rows = this._tbody.selectAll("tr").data(rowsData).enter().append("tr");

        // create a cell in each row for each column
        rows.selectAll("td")
            .data(rowsData.flat())
            .enter()
            .append("td")
            .html((d) => d.value);
    }

    updateRows(rowsData, highlights) {
        this._tbody.selectAll("tr").remove();

        // create a row for each object in the data
        var rows = this._tbody.selectAll("tr").data(rowsData).enter().append("tr");

        // create a cell in each row for each column
        rows.selectAll("td")
            .data((d) => d)
            .enter()
            .append("td")
            .classed("highlight", (d) => highlights?.find((h) => h.row === d.row && h.column === d.column))
            .html((d) => d.value);
    }

    _render() {
        this.shadowRoot.innerHTML = `
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
            <div id="container" class="container"></div>
        `;
    }
}

customElements.define("table-display", TableDisplay);
