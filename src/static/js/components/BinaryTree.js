class BinaryTree extends HTMLElement {
    _MARGIN = { top: 50, right: 20, bottom: 30, left: 20 };
    _WIDTH = window.innerWidth - this._MARGIN.left - this._MARGIN.right;
    _HEIGHT = window.innerHeight - this._MARGIN.top - this._MARGIN.bottom;

    _nodeRadius = 25;

    // declares a tree layout and assigns the size
    _treemap = d3.tree().size([this._WIDTH / 2, this._HEIGHT / 2]);

    _treeData = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this.shadowRoot.querySelector("vis-control").addEventListener("center", () => this.center(400));

        this._svg = d3
            .select(this.shadowRoot.querySelector("#container"))
            .append("svg")
            // Responsive SVG needs these 2 attributes and no width and height attr.
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${this._WIDTH / 2} ${this._HEIGHT - 160}`)
            // Class to make it responsive.
            .classed("svg-content-responsive", true);
        this._g = this._svg.append("g");
        // listen for dragging
        this._dragSvg = d3
            .zoom()
            .on("zoom", (e) => this._g.attr("transform", e.transform))
            .on("start", () => d3.select("body").style("cursor", "move"))
            .on("end", () => d3.select("body").style("cursor", "auto"));

        this._svg.call(this._dragSvg).on("dblclick.zoom", null);
    }

    get data() {
        return this._data || [];
    }

    set data(d) {
        this._data = d;
        this._update();
    }

    static get observedAttributes() {
        return ["node-radius"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "node-radius":
                this._nodeRadius = newValue;
                break;
        }
    }

    highlight(...indices) {
        indices.forEach((index) => this._g.select("#node" + index).attr("class", "node__circle node__circle--highlight"));
    }

    mark(...indices) {
        indices.forEach((index) => this._g.select("#node" + index).attr("class", "node__circle node__circle--mark"));
    }

    lock(...indices) {
        indices.forEach((index) => this._g.select("#node" + index).attr("class", "node__circle node__circle--lock"));
    }

    center(duration) {
        return this._svg.transition().duration(duration).call(this._dragSvg.transform, d3.zoomIdentity.scale(1)).end();
    }

    async swap(index_A, index_B, duration) {
        const nodeA = this._nodes.descendants().find((node) => node.data.index === index_A);
        const nodeB = this._nodes.descendants().find((node) => node.data.index === index_B);

        const temp = { x: nodeA.x, y: nodeA.y };
        nodeA.x = nodeB.x;
        nodeA.y = nodeB.y;
        nodeB.x = temp.x;
        nodeB.y = temp.y;

        await this._wait(duration / 2);

        // no need to stop animation if the data has changed because update() will be called which will reset all the nodes
        await this._node
            .transition()
            .duration(duration / 2)
            .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
            .end();
    }

    _update() {
        this.data.forEach(({ value, modifier }, index) => {
            if (index === 0) this._treeData = { value, modifier, index, children: [] };
            else this._findParent(index).children.push({ value, modifier, index, children: [] });
        });

        //  assigns the data to a hierarchy using parent-child relationships
        this._nodes = d3.hierarchy(this._treeData, (d) => d.children);

        // maps the node data to the tree layout
        this._nodes = this._treemap(this._nodes);

        this._nodes.descendants().forEach((n) => (n.y += this._MARGIN.top));

        this._g.selectAll(".link").remove();

        // adds the links between the nodes
        this._link = this._g
            .selectAll(".link")
            .data(this._nodes.descendants().slice(1))
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("d", (d) => {
                return "M" + d.x + "," + d.y + "L" + d.parent.x + "," + d.parent.y;
            });

        this._g.selectAll(".node").remove();

        // adds each node as a group
        this._node = this._g
            .selectAll(".node")
            .data(this._nodes.descendants())
            .enter()
            .append("g")
            .attr("class", (d) => "node" + (d.children ? " node--internal" : " node--leaf"))
            .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

        // adds the circle to the node
        this._node
            .append("circle")
            .attr("id", (d) => "node" + d.data.index)
            .attr("r", this._nodeRadius)
            .attr("class", (d) => (d.data.modifier ? "node__circle node__circle--" + d.data.modifier : "node__circle"));

        // adds the text to the node
        this._node
            .append("text")
            .attr("dy", ".35em")
            .attr("class", "node__text")
            .style("text-anchor", "middle")
            .text((d) => d.data.value);
    }

    _findElement(i) {
        if (i === 0) return this._treeData;
        if (i % 2 === 1) return this._findElement(Math.floor(i / 2)).children[0];
        if (i % 2 === 0) return this._findElement(i / 2 - 1).children[1];
    }

    _findParent(i) {
        if (i === 0) return null;
        if (i % 2 === 1) return this._findElement(Math.floor(i / 2));
        if (i % 2 === 0) return this._findElement(i / 2 - 1);
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/static/css/index.css" />
            <style>
                :host {
                    display: inline-block;
                }
                vis-control {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    z-index: 1;
                }
                .svg-content-responsive {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                }
                .node {
                    cursor: pointer;
                    user-select: none;
                }
                .node__circle {
                    fill: #fff;
                    stroke: grey;
                    stroke-width: 3px;
                }
                .node__circle--mark {
                    stroke: var(--binary-tree-mark-stroke, #a6141c);
                    fill: var(--binary-tree-mark-fill, #d2898d);
                }
                .node__circle--highlight {
                    stroke: var(--binary-tree-highlight-stroke, #0ca632);
                    fill: var(--binary-tree-highlight-fill, #85d298);
                }
                .node__circle--lock {
                    stroke: var(--binary-tree-lock-stroke, grey);
                    fill: var(--binary-tree-lock-fill, #b9b9b9);
                }
                .node__text {
                    font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;
                }
                .link {
                    fill: none;
                    stroke: #ccc;
                    stroke-width: 6px;
                }
            </style>
            <div id="container"></div>
            <vis-control
                center-icon="${this.hasAttribute("center-icon") ? this.getAttribute("center-icon") : "/static/img/center-icon.png"}"
            ></vis-control>
        `;
    }
}

Object.assign(BinaryTree.prototype, waitMixin);

customElements.define("binary-tree", BinaryTree);
