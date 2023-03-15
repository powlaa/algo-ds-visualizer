class DijkstraView extends HTMLElement {
    _PSEUDOCODE = [
        { code: "<b>Dijkstra</b>(Graph, source)", indent: 0, label: "dijkstra" },
        { code: "<b>for each</b> node v in Graph", indent: 1, label: "for-each-node" },
        { code: "dist[v] = infinity", indent: 2, label: "dist-infinity" },
        { code: "prev[v] = undefined", indent: 2, label: "prev-undefined" },
        { code: "dist[source] = 0", indent: 1, label: "dist-source" },
        { code: "S = the set of all nodes in Graph", indent: 1, label: "s-graph" },
        { code: "<b>while</b> S is not empty", indent: 1, label: "while-s" },
        { code: "u = node in S with min dist[u]", indent: 2, label: "u-min-dist" },
        { code: "remove u from S", indent: 2, label: "remove-u" },
        { code: "<b>for each</b> neighbor v of u", indent: 2, label: "for-each-neighbor" },
        { code: "cost = dist[u] + dist_between(u, v)", indent: 3, label: "cost" },
        { code: "<b>if</b> cost < dist[v]", indent: 3, label: "if-cost" },
        { code: "dist[v] = cost", indent: 4, label: "dist-cost" },
        { code: "prev[v] = u", indent: 4, label: "prev-u" },
        { code: "<b>return</b> prev[]", indent: 1, label: "return" },
    ];

    _nodes = [];
    _edges = [];

    _selectedNode = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._visContainer = this.shadowRoot.querySelector("vis-container");
        this._graphVis = this.shadowRoot.querySelector("graph-creator");
        this._tableVis = this.shadowRoot.querySelector("table-display");
        this._controlPopup = this.shadowRoot.querySelector("#control-popup");
        this._pseudocodeDisplay = this.shadowRoot.querySelector("pseudocode-display");
        this._pseudocodeDisplay.code = this._PSEUDOCODE;

        this._graphVis.addEventListener("node-selected", this._nodeSelected.bind(this));
        this._graphVis.addEventListener("node-deselected", () => (this._selectedNode = null));
        this._graphVis.addEventListener("update-nodes", (e) => {
            this._nodes = e.detail.nodes;
            this._resetDijkstra();
        });
        this._graphVis.addEventListener("update-edges", (e) => {
            this._edges = e.detail.edges;
            this._resetDijkstra();
        });
        this._graphVis.addEventListener("error", (e) => alert(e.detail.message));

        this._visContainer.addEventListener("start", () => {
            if (this._selectedNode) this._runDijkstra(this._selectedNode.id);
            else alert("Please select a node to start from in the graph");
        });

        this._visContainer.addEventListener("show-step", (e) => {
            e.detail.step.animation(this._visContainer.steps, this._visContainer.currentStepIndex);
        });

        this.shadowRoot.querySelector("#control-btn").addEventListener("click", () => this._controlPopup.show());

        this._showExampleGraph();

        this._runDijkstra(this._nodes[0].id);
    }

    static get observedAttributes() {
        return ["control-template-id"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "control-template-id":
                this._controlPopup.setAttribute("template-id", newValue);
                this._controlPopup.show();
                break;
        }
    }

    _nodeSelected(e) {
        this._selectedNode = e.detail.node;
        if (this._visContainer.currentStepIndex === this._visContainer.steps.length - 1) {
            const path = this._tracePath(
                this._visContainer.steps[this._visContainer.currentStepIndex].shortestDistances,
                this._start,
                this._selectedNode.id
            );

            this._showPathInTable(path, this._visContainer.steps, this._visContainer.currentStepIndex);
            this._graphVis.highlightEdges(...path);
        }
    }

    _showExampleGraph() {
        const xLoc = this._graphVis.xLoc;
        const yLoc = this._graphVis.yLoc;
        this._nodes = [
            { title: "A", id: 0, x: xLoc - 200, y: yLoc + 100 },
            { title: "B", id: 1, x: xLoc, y: yLoc },
            { title: "C", id: 2, x: xLoc, y: yLoc + 200 },
            { title: "D", id: 3, x: xLoc + 200, y: yLoc + 200 },
            { title: "E", id: 4, x: xLoc + 200, y: yLoc },
            { title: "F", id: 5, x: xLoc + 400, y: yLoc + 100 },
        ];
        this._edges = [
            { source: this._nodes[0], target: this._nodes[1], weight: 5 },
            { source: this._nodes[0], target: this._nodes[2], weight: 2 },
            { source: this._nodes[1], target: this._nodes[0], weight: 5 },
            { source: this._nodes[1], target: this._nodes[2], weight: 2 },
            { source: this._nodes[1], target: this._nodes[4], weight: 2 },
            { source: this._nodes[2], target: this._nodes[0], weight: 2 },
            { source: this._nodes[2], target: this._nodes[1], weight: 2 },
            { source: this._nodes[2], target: this._nodes[3], weight: 8 },
            { source: this._nodes[2], target: this._nodes[4], weight: 3 },
            { source: this._nodes[3], target: this._nodes[2], weight: 8 },
            { source: this._nodes[3], target: this._nodes[4], weight: 6 },
            { source: this._nodes[3], target: this._nodes[5], weight: 4 },
            { source: this._nodes[4], target: this._nodes[1], weight: 2 },
            { source: this._nodes[4], target: this._nodes[2], weight: 3 },
            { source: this._nodes[4], target: this._nodes[3], weight: 6 },
            { source: this._nodes[4], target: this._nodes[5], weight: 3 },
            { source: this._nodes[5], target: this._nodes[3], weight: 4 },
            { source: this._nodes[5], target: this._nodes[4], weight: 3 },
        ];
        this._graphVis.showGraph(this._nodes, this._edges);
    }

    _showTable(start) {
        var columns = [...this._nodes];
        columns.unshift({ id: "steps", title: "Steps" }, { id: "visited", title: "Q (visited)" }, { id: "unvisited", title: "S (unvisited)" });

        var rows = [{ currentNode: "INIT", shortestDistances: { [start]: { cost: 0, vertex: start } } }];

        rows = rows.map((row) =>
            columns.map((column) => {
                var value;
                switch (column.id) {
                    case "steps":
                        value = "INIT";
                        break;
                    case "visited":
                        value = "{}";
                        break;
                    case "unvisited":
                        value = `{${this._nodes.map((n) => n.title).toString()}}`;
                        break;
                    default:
                        value = row.shortestDistances[column.id]
                            ? row.shortestDistances[column.id].cost + (this._getNodeTitle(row.shortestDistances[column.id].vertex).sub() ?? "")
                            : "∞";
                }
                return {
                    column: column.id,
                    value,
                    row: row.currentNode,
                };
            })
        );

        this._tableVis.showTable(columns, rows);
    }

    _highlightPseudocode(codeLabel) {
        if (codeLabel) this._pseudocodeDisplay.highlightLine(...codeLabel);
        else this._pseudocodeDisplay.highlightLine();
    }

    _updateTable(steps, currentStepIndex, highlights) {
        var columns = [...this._nodes];

        // create a row for each object in the data
        var rows = steps.filter((node, nodeIndex) => {
            if (nodeIndex > currentStepIndex) return false;
            let index = 0;
            return (
                steps
                    .filter((n, i) => i <= currentStepIndex)
                    .findLast((sameNode, sameNodeIndex) => {
                        if (sameNode.currentNode === node.currentNode) index = sameNodeIndex;
                        return sameNode.currentNode === node.currentNode;
                    }) && index === nodeIndex
            );
        });

        columns.unshift({ id: "steps", title: "Steps" }, { id: "visited", title: "Q (visited)" }, { id: "unvisited", title: "S (unvisited)" });

        // create a cell in each row for each column
        rows = rows.map((row, index) =>
            columns.map((column) => {
                var value;
                switch (column.id) {
                    case "steps":
                        value = !index ? "INIT" : index;
                        break;
                    case "visited":
                        if (row.visited && row.currentNode !== "INIT") {
                            if (row.visited.length > 0)
                                value = `{${row.visited.map((n) => this._getNodeTitle(n) ?? n)},${
                                    this._getNodeTitle(row.currentNode) ?? row.currentNode
                                }}`;
                            else value = `{${this._getNodeTitle(row.currentNode) ?? row.currentNode}}`;
                        } else value = "{}";
                        break;
                    case "unvisited":
                        value = `{${
                            row.visited ? this._nodes.filter((n) => row.visited.indexOf(n.id) < 0 && n.id != row.currentNode).map((n) => n.title) : ""
                        }}`;
                        break;
                    default:
                        value = row.shortestDistances[column.id]
                            ? row.shortestDistances[column.id].cost + (this._getNodeTitle(row.shortestDistances[column.id].vertex).sub() ?? "")
                            : "∞";
                }
                return {
                    column: column.id,
                    value,
                    row: row.currentNode,
                };
            })
        );

        this._tableVis.updateRows(rows, highlights);
    }

    _tracePath(shortestDistances, start, vertex, end) {
        var path = [];
        var next = vertex;
        while (next != undefined) {
            path.unshift(next);
            if (next === start) {
                break;
            }
            next = shortestDistances[next]?.vertex;
        }
        if (end !== undefined) path.push(end);

        return path;
    }

    _showPathInTable(path, steps, currentStepIndex) {
        const highlights = path.map((nodeId) => {
            return { row: steps[currentStepIndex].currentNode, column: nodeId };
        });

        this._updateTable(steps, currentStepIndex, highlights);
    }

    _runDijkstra(start) {
        this._start = start;
        this._showTable(start);
        this._visContainer.updateSteps(this._dijkstra(start), { locked: false });
    }

    _resetDijkstra() {
        this._visContainer.setAttribute("locked", "");
        this._visContainer.resetProgressBar();
        this._tableVis.reset();
        this._graphVis.reset();
        this._highlightPseudocode();
    }

    _dijkstra(start) {
        var map = this._formatGraph(this._nodes, this._edges);

        var visited = [];
        var unvisited = [start];
        var shortestDistances = { [start]: { vertex: start, cost: 0 } };

        var vertex;
        var steps = [];

        steps.push({
            shortestDistances: { ...shortestDistances },
            currentNode: "INIT",
            visited: [],
            heading: "Init Dijkstra Algorithm at start node " + this._getNodeTitle(start),
            description: `Calculate the shortest distance from the start node to all other nodes in the graph`,
            codeLabel: ["for-each-node", "dist-infinity", "prev-undefined", "dist-source", "s-graph", "while-s", "u-min-dist", "remove-u"],
            animation: (steps, currentStepIndex) => {
                this._updateTable(steps, currentStepIndex);
                this._highlightPseudocode(steps[currentStepIndex].codeLabel);
                this._graphVis.highlightNodes();
                this._graphVis.highlightEdges();
            },
        });

        while (
            (vertex = unvisited
                .sort((a, b) => {
                    if (b && shortestDistances[a].cost > shortestDistances[b].cost) return 1;
                    if (b && shortestDistances[a].cost < shortestDistances[b].cost) return -1;
                    return 0;
                })
                .shift()) >= 0
        ) {
            if (visited.includes(vertex)) continue;
            // Explore unvisited neighbors
            var neighbors = map.find((n) => n.id === vertex)?.edges.filter((n) => !visited.includes(n.vertex));

            // Add neighbors to the unvisited list
            unvisited.push(...neighbors.map((n) => n.vertex));

            var costToVertex = shortestDistances[vertex].cost;
            var vertexName = this._getNodeTitle(vertex);

            if (vertex !== start)
                steps.push({
                    shortestDistances: { ...shortestDistances },
                    currentNode: vertex,
                    visited: [...visited],
                    heading: "Choose next node: " + vertexName,
                    description: `The next node is the one with the smallest cost, which is ${vertexName} with a cost of ${costToVertex}`,
                    codeLabel: ["while-s", "u-min-dist", "remove-u"],
                    animation: (steps, currentStepIndex) => {
                        this._updateTable(steps, currentStepIndex, [
                            { row: steps[currentStepIndex - 1].currentNode, column: steps[currentStepIndex].currentNode },
                        ]);
                        this._graphVis.highlightEdges();
                        this._graphVis.highlightNodes(steps[currentStepIndex].currentNode);
                        this._highlightPseudocode(steps[currentStepIndex].codeLabel);
                    },
                });

            for (let { vertex: to, cost } of neighbors) {
                var currCostToNeighbor = shortestDistances[to] && shortestDistances[to].cost;
                var newCostToNeighbor = costToVertex + cost;
                if (currCostToNeighbor == undefined || newCostToNeighbor < currCostToNeighbor) {
                    // Update the table
                    shortestDistances[to] = { vertex, cost: newCostToNeighbor };
                    steps.push({
                        shortestDistances: { ...shortestDistances },
                        currentNode: vertex,
                        visited: [...visited],
                        heading: "Explore neighbors of " + (vertex === start ? "start node " : "node ") + vertexName,
                        description: `The path from ${this._getNodeTitle(start)} to ${this._getNodeTitle(to)} via ${vertexName} has a cost of ${
                            costToVertex + cost
                        } which is the shortest path so far`,
                        codeLabel: ["for-each-neighbor", "cost", "if-cost", "dist-cost", "prev-u"],
                        animation: (steps, currentStepIndex) => {
                            this._graphVis.highlightEdges(
                                ...this._tracePath({ ...shortestDistances }, start, steps[currentStepIndex].currentNode, to)
                            );
                            this._updateTable(steps, currentStepIndex, [{ row: steps[currentStepIndex].currentNode, column: to }]);
                            this._highlightPseudocode(steps[currentStepIndex].codeLabel);
                        },
                    });
                } else {
                    steps.push({
                        shortestDistances: { ...shortestDistances },
                        currentNode: vertex,
                        visited: [...visited],
                        heading: "Explore neighbors of " + (vertex === start ? "start node " : "node ") + vertexName,
                        description: `The path from ${this._getNodeTitle(start)} to ${this._getNodeTitle(to)} via ${vertexName} has a cost of ${
                            costToVertex + cost
                        } which is bigger than the current shortest path with a cost of ${currCostToNeighbor} via ${this._getNodeTitle(
                            shortestDistances[to].vertex
                        )}`,
                        codeLabel: ["for-each-neighbor", "cost", "if-cost"],
                        animation: (steps, currentStepIndex) => {
                            this._graphVis.highlightEdges(
                                ...this._tracePath({ ...shortestDistances }, start, steps[currentStepIndex].currentNode, to)
                            );
                            this._updateTable(steps, currentStepIndex);
                            this._highlightPseudocode(steps[currentStepIndex].codeLabel);
                        },
                    });
                }
            }

            visited.push(vertex);
        }
        steps.push({
            shortestDistances: { ...shortestDistances },
            currentNode: steps[steps.length - 1].currentNode,
            visited: [...visited],
            heading: "Dijkstra is done",
            description: "Select a node to show the shortest path from the start node",
            codeLabel: ["return"],
            animation: (steps, currentStepIndex) => {
                this._updateTable(steps, currentStepIndex);
                this._graphVis.highlightNodes();
                this._graphVis.highlightEdges();
                this._highlightPseudocode(steps[currentStepIndex].codeLabel);
            },
        });

        this._graphVis.markNodes(start);

        return steps;
    }

    _formatGraph(nodes, edges) {
        const tmp = [...nodes];
        tmp.forEach((n) => {
            edges.forEach((e) => {
                if (!n.edges) n.edges = [];
                if (e.source.id === n.id && n.edges.find((el) => el.vertex === e.target.id))
                    n.edges.find((el) => el.vertex === e.target.id).cost = e.weight;
                if (e.source.id === n.id && !n.edges.find((el) => el.vertex === e.target.id)) n.edges.push({ vertex: e.target.id, cost: e.weight });
            });
        });
        return tmp;
    }

    _getNodeTitle(id) {
        return this._nodes.find((c) => c.id === id)?.title;
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .content {
                    width: 100%;
                    height: calc(100vh - 160px);
                    --split-layout-height: calc(100% - 190px);
                }

                .content__graph-creator {
                    display: inline-block;
                    position: relative;
                    vertical-align: top;
                    overflow: hidden;
                    width: 100%;
                    height: 100%;
                }
                .content__table-display {
                    width: 100%;
                    height: 100%;
                }
                .content__pseudocode {
                    width: 100%;
                    --pseudocode-highlight-background-color: #b0e2d9;
                    --pseudocode-highlight-background-color-alternate: #b0e2d9aa;
                }
                .popup {
                    --popup-display: grid;
                    --popup-top: none;
                    --popup-bottom: 1.5em;
                    --popup-left: -2px;
                    --popup-height: none;
                    --popup-width: 35%;
                    --popup-min-width: 350px;
                    --popup-border-radius: 0 10px 0 0;
                    --popup-grid-template-columns: auto auto;
                    --popup-z-index: 2;
                }
                .button {
                    position: absolute;
                    bottom: 3em;
                    left: 8px;
                    z-index: 1;
                    width: 30px;
                    height: 30px;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 50%;
                    font-size: 20px;
                    font-weight: bold;
                    cursor: pointer;
                }
            </style>

            <vis-container title="Dijkstra" locked popup-template-id="${this.getAttribute("popup-template-id")}">
                <split-layout class="content" top-bottom-right>
                    <graph-creator class="content__graph-creator" slot="left" no-negative-edge-weights></graph-creator>
                    <table-display class="content__table-display" slot="top-right"></table-display>
                    <pseudocode-display slot="bottom-right" class="content__pseudocode"></pseudocode-display>
                </split-layout>
                <pop-up id="control-popup" class="popup"></pop-up>
                <button id="control-btn" class="button">?</button>
            </vis-container>
        `;
    }
}

customElements.define("dijkstra-view", DijkstraView);
