class AStarView extends HTMLElement {
    _PSEUDOCODE = [
        { code: "<b>A* search</b>(Graph, source)", indent: 0, label: "a-star-search" },
        { code: "<b>for each</b> node v in Graph", indent: 1, label: "for-each-node" },
        { code: "dist[v] = infinity", indent: 2, label: "dist-infinity" },
        { code: "prev[v] = undefined", indent: 2, label: "prev-undefined" },
        { code: "openSet = {start}", indent: 1, label: "open-set" },
        { code: "closedSet = {}", indent: 1, label: "closed-set" },
        { code: "gScore = {start: 0}", indent: 1, label: "g-score" },
        { code: "fScore = {start: heuristic_cost_estimate(start, goal)}", indent: 1, label: "f-score" },
        { code: "<b>while</b> openSet is not empty", indent: 1, label: "while-open-set" },
        { code: "current = node in openSet with lowest fScore", indent: 2, label: "current" },
        { code: "<b>if</b> current == goal", indent: 2, label: "if-goal" },
        { code: "path = reconstruct_path(cameFrom, current)", indent: 3, label: "path" },
        { code: "<b>return</b> path", indent: 3, label: "return" },
        { code: "openSet.remove(current)", indent: 2, label: "remove-current" },
        { code: "closedSet.add(current)", indent: 2, label: "add-current" },
        { code: "<b>for each</b> neighbor in neighbors(current)", indent: 2, label: "for-each-neighbor" },
        { code: "<b>if</b> neighbor in closedSet", indent: 3, label: "if-neighbor-in-closed-set" },
        { code: "continue", indent: 4, label: "continue" },
        { code: "tentative_gScore = gScore[current] + dist_between(current, neighbor)", indent: 3, label: "tentative-g-score" },
        { code: "<b>if</b> neighbor not in openSet", indent: 3, label: "if-neighbor-not-in-open-set" },
        { code: "openSet.add(neighbor)", indent: 4, label: "add-neighbor" },
        { code: "<b>else if</b> tentative_gScore >= gScore[neighbor]", indent: 3, label: "else-if-tentative-g-score" },
        { code: "continue", indent: 4, label: "continue" },
        { code: "cameFrom[neighbor] = current", indent: 3, label: "came-from" },
        { code: "gScore[neighbor] = tentative_gScore", indent: 3, label: "update-g-score" },
        { code: "fScore[neighbor] = gScore[neighbor] + heuristic_cost_estimate(neighbor, goal)", indent: 3, label: "update-f-score" },
        { code: "<b>return</b> null", indent: 1, label: "return-null" },
    ];
    

    _nodes = [];
    _edges = [];

    _startNode = null;
    _endNode = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._visContainer = this.shadowRoot.querySelector("vis-container");
        this._splitLayout = this.shadowRoot.querySelector("split-layout");
        this._graphVis = this.shadowRoot.querySelector("graph-creator");
        this._tableVis = this.shadowRoot.querySelector("table-display");
        this._controlPopup = this.shadowRoot.querySelector("#control-popup");
        this._pseudocodeDisplay = this.shadowRoot.querySelector("pseudocode-display");
        this._pseudocodeDisplay.code = this._PSEUDOCODE;

        this._graphVis.addEventListener("start-selected", (e) => (this._startNode = e.detail.node));
        this._graphVis.addEventListener("start-deselected", () => (this._startNode = null));

        this._graphVis.addEventListener("end-selected", (e) => (this._endNode = e.detail.node));
        this._graphVis.addEventListener("end-deselected", () => (this._endNode = null));

        this._graphVis.addEventListener("update-nodes", (e) => {
            this._nodes = e.detail.nodes;
            this._resetAStar();
        });
        this._graphVis.addEventListener("update-edges", (e) => {
            this._edges = e.detail.edges;
            this._resetAStar();
        });
        this._graphVis.addEventListener("error", (e) => alert(e.detail.message));
        this._graphVis.addEventListener("delete", () => {
            this._resetAStar();
            this._nodes = [];
            this._edges = [];
            this._graphVis.showGraph(this._nodes, this._edges);
        });
        this._graphVis.addEventListener("help", () => this._controlPopup.toggle());

        this._visContainer.addEventListener("start", () => {
            if (this._startNode && this._endNode) this._runAStar(this._startNode.id, this._endNode.id);
            else alert("Please select a node to start and a node to end from in the graph");
        });

        this._visContainer.addEventListener("show-step", (e) => {
            e.detail.step?.animation(this._visContainer.steps, this._visContainer.currentStepIndex);
        });

        this._visContainer.addEventListener("code", this._toggleCode.bind(this));

        this._showExampleGraph();

        this._runAStar(this._nodes[0].id, this._nodes[this._nodes.length-1].id);
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
        this._startNode = e.detail.node;
    }

    _endSelected(e) {
        this._endNode = e.detail.node;
    }

    _showExampleGraph() {
        const xLoc = this._graphVis.xLoc;
        const yLoc = this._graphVis.yLoc;
        this._nodes = [
            { title: "A", id: 0, x: xLoc - 200, y: yLoc },
            { title: "B", id: 1, x: xLoc, y: yLoc },
            { title: "C", id: 2, x: xLoc, y: yLoc + 200 },
            { title: "D", id: 3, x: xLoc + 200, y: yLoc + 200 },
            { title: "E", id: 4, x: xLoc + 200, y: yLoc },
            { title: "F", id: 5, x: xLoc + 400, y: yLoc + 200 },
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
        this._graphVis.showGraph(this._nodes, this._edges, true);
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

    _runAStar(start, end) {
        this._start = start;
        this._end = end;
        this._showTable(start);
        this._visContainer.updateSteps(this._astar(start, end), { locked: false, currentStep: 0 });
    }

    _resetAStar() {
        this._visContainer.updateSteps([], { locked: true });
        this._visContainer.reset();
        this._tableVis.reset();
        this._graphVis.reset();
        this._highlightPseudocode();
    }

    _astar(start, end) {
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
            heading: "Init A* Algorithm at start node " + this._getNodeTitle(start) + " and end node " + this._getNodeTitle(end),
            description: `Calculate the shortest distance from the start node to the end node`,
            codeLabel: ["for-each-node", "dist-infinity", "prev-undefined", "open-set", "closed-set"],
            animation: (steps, currentStepIndex) => {
                this._updateTable(steps, currentStepIndex);
                this._highlightPseudocode(steps[currentStepIndex].codeLabel);
                this._graphVis.highlightNodes();
                this._graphVis.highlightEdges();
            },
        });

        // Calculate the heuristics for node to the end node
        var calculateHeuristic = (node) => {
            const dx = node.x - map.at(end).x;
            const dy = node.y - map.at(end).y;
            return Math.round(Math.sqrt(dx * dx + dy * dy) / 100);
        };

        var heuristics = {};
        for (var node of map) {
            heuristics[node.id] = calculateHeuristic(node);
            console.log(node)
        }

        console.log(heuristics)

        steps.push({
            shortestDistances: { ...shortestDistances },
            currentNode: "TEST",
            visited: [],
            heading: "Init A* Algorithm at start node " + this._getNodeTitle(start) + " and end node " + this._getNodeTitle(end),
            description: `Calculate the shortest distance from the start node to the end node`,
            codeLabel: ["for-each-node", "dist-infinity", "prev-undefined", "open-set", "closed-set"],
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
                    // Sort the unvisited nodes by the estimated total cost (heuristic + actual cost) to reach the end node
                    var costA = shortestDistances[a].cost + heuristics[a];
                    var costB = shortestDistances[b].cost + heuristics[b];
                    return costA - costB;
                })
                .shift()) >= 0
        ) {
            if (vertex === end) break;
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
            heading: "A* is done",
            description: "",
            codeLabel: ["return"],
            animation: (steps, currentStepIndex) => {
                this._updateTable(steps, currentStepIndex);
                this._graphVis.highlightNodes();
                this._graphVis.highlightEdges();
                this._highlightPseudocode(steps[currentStepIndex].codeLabel);
            },
        });

        this._graphVis.markNodes(start);
        this._graphVis.markEnd(end);
        
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

    _toggleCode() {
        const visible = this._pseudocodeDisplay.toggleCode();
        this._splitLayout.toggleRightResizerVertical();
        if (visible) this._splitLayout.setTopRightHeight(50);
        else this._splitLayout.setTopRightHeight(99);
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
            </style>

            <vis-container title="A*" locked popup-template-id="${this.getAttribute("popup-template-id")}">
                <split-layout class="content" top-bottom-right>
                    <graph-creator class="content__graph-creator" slot="left" no-negative-edge-weights></graph-creator>
                    <table-display class="content__table-display" slot="top-right"></table-display>
                    <pseudocode-display slot="bottom-right" class="content__pseudocode"></pseudocode-display>
                </split-layout>
                <pop-up id="control-popup" class="popup"></pop-up>
            </vis-container>
        `;
    }
}

customElements.define("astar-view", AStarView);
