class GraphCreator extends HTMLElement {
    _CONSTS = {
        selectedClass: "selected",
        connectClass: "connect-node",
        circleGClass: "conceptG",
        graphClass: "graph",
        activeEditId: "active-editing",
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
        nodeRadius: 25,
    };
    _idct = 0;

    _nodeSelected = (node) => new CustomEvent("node-selected", { detail: { node } });
    _nodeDeselected = new CustomEvent("node-deselected");
    _updateNodes = (nodes) => new CustomEvent("update-nodes", { detail: { nodes } });
    _updateEdges = (edges) => new CustomEvent("update-edges", { detail: { edges } });
    _error = (message) => new CustomEvent("error", { detail: { message } });

    _state = {
        selectedNode: null,
        selectedEdge: null,
        mouseDownNode: null,
        mouseDownLink: null,
        mouseOverNode: null,
        justDragged: false,
        justScaleTransGraph: false,
        lastKeyDown: -1,
        shiftNodeDrag: false,
        selectedText: null,
    };

    _docEl = document.documentElement;
    _bodyEl = document.getElementsByTagName("body")[0];

    _width = window.innerWidth || this._docEl.clientWidth || this._bodyEl.clientWidth;
    _height = window.innerHeight || this._docEl.clientHeight || this._bodyEl.clientHeight;

    _xLoc = this._width / 5 - 25;
    _yLoc = 100;

    _nodes = [];
    _edges = [];

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
            .attr("viewBox", `0 0 ${this._width / 2} ${this._height - 160}`)
            // Class to make it responsive.
            .classed("svg-content-responsive", true);
    }

    get nodes() {
        return this._nodes;
    }

    set nodes(nodes) {
        this._nodes = nodes;
    }

    get edges() {
        return this._edges;
    }

    set edges(edges) {
        this._edges = edges;
    }

    get xLoc() {
        return this._xLoc;
    }

    get yLoc() {
        return this._yLoc;
    }

    showGraph(nodes, edges, init) {
        this.nodes = nodes;
        this.edges = edges;
        this._idct = this.nodes.length;
        if (init) this._initGraph();
        else this._updateGraph();
    }

    reset() {
        this.highlightEdges();
        this.markEdges();
        this.highlightNodes();
        this.markNodes();
    }

    highlightEdges(...ids) {
        //highlight link if it is on the path of the ids
        this._paths.classed("highlight", (d, index, paths) => {
            let found = false;
            for (let [i, id] of ids.entries()) if (i <= ids.length - 2 && d.source.id === id && d.target.id === ids[i + 1]) found = true;
            if (found) d3.select(paths[index]).classed("mark", false);
            return found;
        });
    }

    highlightNodes(...ids) {
        this._circles.classed("highlight", (d, index, circles) => {
            if (ids.indexOf(d.id) < 0) return false;
            d3.select(circles[index]).classed("mark", false);
            return true;
        });
    }

    markEdges(...ids) {
        this._paths.classed("mark", (d, index, paths) => {
            let found = false;
            for (let [i, id] of ids.entries()) if (i <= ids.length - 2 && d.source.id === id && d.target.id === ids[i + 1]) found = true;
            if (found) d3.select(paths[index]).classed("highlight", false);
            return found;
        });
    }

    markNodes(...ids) {
        this._circles.classed("mark", (d, index, circles) => {
            if (ids.indexOf(d.id) < 0) return false;
            d3.select(circles[index]).classed("highlight", false);
            return true;
        });
    }

    center(duration) {
        return this._svg.transition().duration(duration).call(this._dragSvg.transform, d3.zoomIdentity.scale(1)).end();
    }

    _initGraph() {
        // define arrow markers for graph links
        var defs = this._svg.append("svg:defs");
        defs.append("svg:marker")
            .attr("id", "end-arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", "32")
            .attr("markerWidth", 1.9)
            .attr("markerHeight", 1.9)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // define arrow markers for leading arrow
        defs.append("svg:marker")
            .attr("id", "mark-end-arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 7)
            .attr("markerWidth", 1.8)
            .attr("markerHeight", 1.8)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        this._g = this._svg.append("g").classed(this._CONSTS.graphClass, true);

        // displayed when dragging between nodes
        this._dragLine = this._g
            .append("svg:path")
            .attr("class", "link dragline hidden")
            .attr("d", "M0,0L0,0")
            .style("marker-end", "url(#mark-end-arrow)");

        // svg nodes and edges
        this._paths = this._g.append("g").selectAll("g");
        this._pathWeights = this._g.append("g").selectAll("g");
        this._circles = this._g.append("g").selectAll("g");

        this._drag = d3
            .drag()
            .on("drag", (e, d) => {
                this._state.justDragged = true;
                this._dragmove(e, d);
            })
            .on("end", (e, d) => {
                if (this._state.mouseOverNode && d3.select(this._state.mouseOverNode).select("circle").data()[0] !== d)
                    this._circleMouseUp(
                        d3.select(this._state.mouseOverNode).select("circle"),
                        e,
                        d3.select(this._state.mouseOverNode).select("circle").data()[0]
                    );
                else this._svgMouseUp(e, d);
            });

        // listen for key events
        d3.select(window).on("keydown", this._svgKeyDown.bind(this)).on("keyup", this._svgKeyUp.bind(this));
        this._svg.on("mousedown", this._svgMouseDown.bind(this));
        //NOTE: use click because mouseup doesn't work because of d3 drag behavior
        this._svg.on("click", this._svgMouseUp.bind(this));

        // listen for dragging
        this._dragSvg = d3
            .zoom()
            .on("zoom", this._zoomed.bind(this))
            .on("start", (e) => {
                var ael = d3.select("#" + this._CONSTS.activeEditId).node();
                if (ael) {
                    ael.blur();
                }
                if (!e.shiftKey) d3.select("body").style("cursor", "move");
            })
            .on("end", () => {
                d3.select("body").style("cursor", "auto");
            });

        this._svg.call(this._dragSvg).on("dblclick.zoom", null);

        // listen for resize
        window.onresize = this._updateWindow.bind(this, this._svg);

        // handle delete graph
        d3.select("#delete-graph").on("click", this.deleteGraph.bind(this, false));
        this._updateGraph();
    }

    _updateGraph() {
        var paths = this._paths.data(this.edges, (d) => `${d.source.id}+${d.target.id}`);

        //add new links, merge with existing ones and update
        this._paths = paths
            .enter()
            .append("path")
            .on("mousedown", (e, d) => {
                this._pathMouseDown(d3.select(e.currentTarget), e, d);
            })
            .on("click", (e, d) => {
                this._pathMouseUp(d3.select(e.currentTarget), e, d);
            })
            .merge(paths)
            .style("marker-end", (d) => {
                return this.edges.find((e) => e.source.id === d.source.id && e.target.id === d.target.id) &&
                    this.edges.find((e) => e.source.id === d.target.id && e.target.id === d.source.id)
                    ? ""
                    : "url(#end-arrow)";
            })
            .classed("link", true)
            .attr("id", (d) => `path-${d.source.id}-${d.target.id}`)
            .attr("d", (d) => "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y);

        // remove old links
        paths.exit().remove();

        var pathWeights = this._pathWeights.data(this.edges);

        //add new pathWeights, merge with existing ones and update
        this._pathWeights = pathWeights
            .enter()
            .append("text")
            .text((d) => d.weight)
            .merge(pathWeights)
            .attr("id", (d) => `weight-${d.source.id}-${d.target.id}`)
            .attr("transform", (d) => `translate(${(d.source.x + d.target.x) / 2 + 5}, ${(d.source.y + d.target.y) / 2 - 10})`);

        //remove old pathWeights
        pathWeights.exit().remove();

        // update existing nodes
        var newGs = this._circles.data(this.nodes, (d) => d.id);

        // add new nodes
        this._circles = newGs
            .enter()
            .append("g")
            .classed(this._CONSTS.circleGClass, true)
            .on("mouseover", (e) => {
                if (this._state.shiftNodeDrag) d3.select(e.currentTarget).classed(this._CONSTS.connectClass, true);
                this._state.mouseOverNode = e.currentTarget;
            })
            .on("mouseout", (e) => {
                this._state.mouseOverNode = null;
                d3.select(e.currentTarget).classed(this._CONSTS.connectClass, false);
            })
            .on("mousedown", (e, d) => {
                this._circleMouseDown(e, d);
            })
            .on("click", (e, d) => {
                this._circleMouseUp(d3.select(e.currentTarget), e, d);
            })
            .call(this._drag);
        this._circles.append("circle").attr("r", String(this._CONSTS.nodeRadius));
        this._circles.each((d, i, nodes) => {
            this._insertTitleLinebreaks(d3.select(nodes[i]), d.title);
        });
        this._circles = this._circles.merge(newGs).attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

        // remove old nodes
        newGs.exit().remove();
    }

    _dragmove(e, d) {
        if (this._state.shiftNodeDrag) {
            this._dragLine.attr("d", "M" + d.x + "," + d.y + "L" + e.x + "," + e.y);
        } else {
            d.x += e.dx;
            d.y += e.dy;
            this._updateGraph();
        }
    }

    // mousedown on main svg
    _svgMouseDown() {
        this._state.graphMouseDown = true;
    }

    // mouseup on main svg
    _svgMouseUp(e, d) {
        if (this._state.justScaleTransGraph) {
            // dragged not clicked
            this._state.justScaleTransGraph = false;
        } else if (this._state.graphMouseDown && e.shiftKey) {
            const xy = d3.pointer(e);
            const transform = d3.zoomTransform(this._svg.node());
            const xyZoomPan = transform.invert(xy);
            // clicked not dragged from svg
            var d = { id: this._idct++, title: "new", x: xyZoomPan[0], y: xyZoomPan[1] };
            this._nodes.push(d);
            this.dispatchEvent(this._updateNodes(this._nodes));

            this._updateGraph();
            // make title of text immediately editable
            var d3txt = this._changeTextOfNode(
                this._circles.filter((dval) => dval.id === d.id),
                d
            );
            var txtNode = d3txt.node();
            this._selectElementContents(txtNode);
            txtNode.focus();
        } else if (this._state.shiftNodeDrag) {
            // dragged from node
            this._state.shiftNodeDrag = false;
            this._dragLine.classed("hidden", true);
        }
        this._state.graphMouseDown = false;
    }

    // keydown on main svg
    _svgKeyDown(e) {
        // make sure repeated key presses don't register for each keydown
        if (this._state.lastKeyDown !== -1) return;

        this._state.lastKeyDown = e.keyCode;
        var selectedNode = this._state.selectedNode,
            selectedEdge = this._state.selectedEdge;

        switch (e.keyCode) {
            case this._CONSTS.BACKSPACE_KEY:
            case this._CONSTS.DELETE_KEY:
                e.preventDefault();
                if (selectedNode) {
                    this.nodes.splice(this.nodes.indexOf(selectedNode), 1);
                    this._spliceLinksForNode(selectedNode);
                    this.dispatchEvent(this._updateNodes(this._nodes));
                    this.dispatchEvent(this._updateEdges(this._edges));
                    this._state.selectedNode = null;
                    this._updateGraph();
                } else if (selectedEdge) {
                    this._edges.splice(this.edges.indexOf(selectedEdge), 1);
                    this.dispatchEvent(this._updateEdges(this._edges));
                    this._state.selectedEdge = null;
                    this._updateGraph();
                }
                break;
        }
    }

    _svgKeyUp() {
        this._state.lastKeyDown = -1;
    }

    _circleMouseDown(e, d) {
        e.stopPropagation();
        this._state.mouseDownNode = d;
        if (e.shiftKey) {
            this._state.shiftNodeDrag = e.shiftKey;
            // reposition dragged directed edge
            this._dragLine.classed("hidden", false).attr("d", "M" + d.x + "," + d.y + "L" + d.x + "," + d.y);
            return;
        }
    }

    // mouseup on nodes
    _circleMouseUp(d3node, e, d) {
        // reset the states
        this._state.shiftNodeDrag = false;
        d3node.classed(this._CONSTS.connectClass, false);

        var mouseDownNode = this._state.mouseDownNode;

        if (!mouseDownNode) return;

        this._dragLine.classed("hidden", true);

        if (mouseDownNode !== d) {
            // we're in a different node: create new edge for mousedown edge and add to graph
            var newEdge = { source: mouseDownNode, target: d, weight: 1 };
            var filtRes = this._paths.filter((p) => p.source === newEdge.source && p.target === newEdge.target);
            if (filtRes.data().length === 0) {
                this._edges.push(newEdge);
                this.dispatchEvent(this._updateEdges(this._edges));
                this._updateGraph();
            }
        } else {
            // we're in the same node
            if (this._state.justDragged) {
                // dragged, not clicked
                this._state.justDragged = false;
            } else {
                // clicked, not dragged
                if (e.shiftKey) {
                    // shift-clicked node: edit text content
                    var d3txt = this._changeTextOfNode(d3node, d);
                    var txtNode = d3txt.node();
                    this._selectElementContents(txtNode);
                    txtNode.focus();
                } else {
                    if (this._state.selectedEdge) {
                        this._removeSelectFromEdge();
                    }
                    var prevNode = this._state.selectedNode;

                    if (!prevNode || prevNode.id !== d.id) {
                        this._replaceSelectNode(d3node, d);
                    } else {
                        this._removeSelectFromNode(true);
                    }
                }
            }
        }
        this._state.mouseDownNode = null;
        return;
    }

    _pathMouseUp(d3path, e, d) {
        if (!this._state.mouseDownLink) return;

        if (e.shiftKey) {
            var d3txt = this._changeWeightOfLink(d3path, d);
            var txtNode = d3txt.node();
            this._selectElementContents(txtNode);
            txtNode.focus();
        }

        this._state.mouseDownLink = null;
    }

    _pathMouseDown(d3path, e, d) {
        this._state.mouseDownLink = d;
        e.stopPropagation();

        if (this._state.selectedNode) {
            this._removeSelectFromNode(true);
        }

        var prevEdge = this._state.selectedEdge;
        if (!prevEdge || prevEdge !== d) {
            this._replaceSelectEdge(d3path, d);
        } else {
            this._removeSelectFromEdge();
        }
    }

    // call to propagate changes to graph
    _zoomed(e) {
        this._state.justScaleTransGraph = true;
        d3.select(this.shadowRoot.querySelector("." + this._CONSTS.graphClass)).attr("transform", e.transform);
    }

    _updateWindow(svg) {
        var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName("body")[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    }

    deleteGraph(skipPrompt) {
        var doDelete = true;
        if (!skipPrompt) {
            doDelete = window.confirm("Press OK to delete this graph");
        }
        if (doDelete) {
            this.nodes = [];
            this.edges = [];
            this._updateGraph();
        }
    }
    /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
    _selectElementContents(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
    /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
    _insertTitleLinebreaks(gEl, title) {
        var words = title.split(/\s+/g),
            nwords = words.length;
        var el = gEl
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-" + (nwords - 1) * 7.5)
            .attr("y", "3");

        for (var i = 0; i < words.length; i++) {
            var tspan = el.append("tspan").text(words[i]);
            if (i > 0) tspan.attr("x", 0).attr("dy", "15");
        }
    }

    // remove edges associated with a node
    _spliceLinksForNode(node) {
        var toSplice = this.edges.filter((l) => l.source === node || l.target === node);
        toSplice.map((l) => {
            this._edges.splice(this.edges.indexOf(l), 1);
        });
    }
    _replaceSelectEdge(d3Path, edgeData) {
        d3Path.classed(this._CONSTS.selectedClass, true);
        if (this._state.selectedEdge) {
            this._removeSelectFromEdge();
        }
        this._state.selectedEdge = edgeData;
    }

    _replaceSelectNode(d3Node, nodeData) {
        d3Node.classed(this._CONSTS.selectedClass, true);
        if (this._state.selectedNode) {
            this._removeSelectFromNode(false);
        }
        this._state.selectedNode = nodeData;
        this.dispatchEvent(this._nodeSelected(nodeData));
    }

    _removeSelectFromNode(notify) {
        this._circles.filter((cd) => cd.id === this._state.selectedNode.id).classed(this._CONSTS.selectedClass, false);
        this._state.selectedNode = null;
        if (notify) this.dispatchEvent(this._nodeDeselected);
    }

    _removeSelectFromEdge() {
        this._paths.filter((cd) => cd === this._state.selectedEdge).classed(this._CONSTS.selectedClass, false);
        this._state.selectedEdge = null;
    }

    /* place editable text on node in place of svg text */
    _changeTextOfNode(d3node, d) {
        d3node.selectAll("text").remove();
        var nodeBCR = d3node.node().getBoundingClientRect(),
            curScale = nodeBCR.width / this._CONSTS.nodeRadius,
            placePad = 5 * curScale,
            useHW = curScale > 1 ? nodeBCR.width * 0.71 : this._CONSTS.nodeRadius * 1.42;
        // replace with editableconent text
        var d3txt = this._svg
            .selectAll("foreignObject")
            .data([d])
            .enter()
            .append("foreignObject")
            .attr("x", nodeBCR.left + placePad)
            .attr("y", nodeBCR.top + placePad - 110)
            .attr("height", 2 * useHW)
            .attr("width", useHW)
            .append("xhtml:p")
            .attr("id", this._CONSTS.activeEditId)
            .attr("contentEditable", "true")
            .text(d.title)
            .on("mousedown", (e) => {
                e.stopPropagation();
            })
            .on("keydown", (e, d) => {
                e.stopPropagation();
                if (e.keyCode == this._CONSTS.ENTER_KEY && !e.shiftKey) {
                    e.currentTarget.blur();
                }
            })
            .on("blur", (e, d) => {
                d.title = e.currentTarget.textContent.slice(0, 4);
                this.dispatchEvent(this._updateNodes(this._nodes));
                this._insertTitleLinebreaks(d3node, d.title);
                d3.select(e.currentTarget.parentElement).remove();
            });
        return d3txt;
    }

    /* place editable text on edge weight in place of svg text */
    _changeWeightOfLink(d3path, d) {
        var ids = d3path.attr("id").match(/\d+/g);
        var source = ids[0];
        var target = ids[1];
        var weight = d3.select(this.shadowRoot.querySelector(`#weight-${source}-${target}`));
        var weightBack = d3.select(this.shadowRoot.querySelector(`#weight-${target}-${source}`));

        var nodeBCR = weight.node().getBoundingClientRect();
        // replace with editableconent text
        var d3txt = this._svg
            .selectAll("foreignObject")
            .data([d])
            .enter()
            .append("foreignObject")
            .attr("x", nodeBCR.x)
            .attr("y", nodeBCR.y - 115)
            .attr("height", 50)
            .attr("width", 40)
            .append("xhtml:p")
            .attr("id", this._CONSTS.activeEditId)
            .attr("contentEditable", "true")
            .text(d.weight)
            .style("background", "white")
            .on("mousedown", (e) => {
                e.stopPropagation();
            })
            .on("keydown", (e) => {
                e.stopPropagation();
                if (e.keyCode == this._CONSTS.ENTER_KEY && !e.shiftKey) {
                    e.currentTarget.blur();
                }
            })
            .on("blur", (e, d) => {
                const newWeight = parseInt(e.currentTarget.textContent);
                if (isNaN(newWeight) || (this.hasAttribute("no-negative-edge-weights") && newWeight < 0)) {
                    d3.select(e.currentTarget.parentElement).remove();
                    this.dispatchEvent(
                        this._error(
                            `Invalid edge weight value, make sure it is a number${
                                this.hasAttribute("no-negative-edge-weights") ? " and not negative" : ""
                            }`
                        )
                    );
                    return;
                }
                d.weight = newWeight;
                var edgeBack = this._edges.find((e) => e.source.id == target && e.target.id == source);
                if (edgeBack) edgeBack.weight = newWeight;
                weight.text(newWeight);
                if (weightBack) weightBack.text(newWeight);

                this.dispatchEvent(this._updateEdges(this._edges));

                d3.select(e.currentTarget.parentElement).remove();
            });
        return d3txt;
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                vis-control {
                    position: absolute;
                    bottom: 30px;
                    right: 10px;
                    z-index: 1;
                }
                p {
                    text-align: center;
                    overflow: overlay;
                    position: relative;
                }

                .svg-content-responsive {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                }

                .container {
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                    background-color: rgb(248, 248, 248);
                }

                #toolbox {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    margin-bottom: 1.5em;
                    margin-left: 1em;
                    border: 2px solid #eeeeee;
                    border-radius: 5px;
                    padding: 1em;
                    z-index: 5;
                }

                #toolbox input {
                    width: 30px;
                    opacity: 0.4;
                }
                #toolbox input:hover {
                    opacity: 1;
                    cursor: pointer;
                }

                #hidden-file-upload {
                    display: none;
                }

                #download-input {
                    margin: 0 0.5em;
                }

                .conceptG text {
                    pointer-events: none;
                }

                marker {
                    fill: #aaa;
                }

                g.conceptG circle {
                    fill: #f6fbff;
                    stroke: #bbb;
                    stroke-width: 2px;
                }
                g.conceptG.highlight circle {
                    stroke: var(--graph-highlight-stroke, #a6141c);
                    fill: var(--graph-highlight-fill, #d2898d);
                }
                g.conceptG.mark circle {
                    stroke: var(--graph-mark-stroke, #0ca632);
                    fill: var(--graph-mark-fill, #85d298);
                }

                g.conceptG:hover circle {
                    fill: #ddd;
                }

                g.selected circle {
                    fill: #b0e2d9;
                }
                g.selected:hover circle {
                    fill: #a7d8cf;
                }

                path.link {
                    fill: none;
                    stroke: rgba(0, 0, 0, 0.1);
                    stroke-width: 6px;
                    cursor: default;
                }

                path.link:hover {
                    stroke: rgb(171, 171, 171);
                }

                g.connect-node circle {
                    fill: #beffff;
                }

                path.link.hidden {
                    stroke-width: 0;
                }

                path.link.selected {
                    stroke: #b0e2d9;
                }
                path.link.highlight {
                    stroke: var(--graph-link-highlight, rgba(166, 20, 28, 0.7));
                }
                path.link.mark {
                    stroke: var(--graph-link-mark, rgba(12, 166, 50, 0.7));
                }
            </style>
            <div id="container" class="container"></div>
            <vis-control
                del
                help
                center-icon="${this.hasAttribute("center-icon") ? this.getAttribute("center-icon") : "/static/img/center-icon.png"}"
                delete-icon="${this.hasAttribute("delete-icon") ? this.getAttribute("delete-icon") : "/static/img/delete-icon.png"}"
                help-icon="${this.hasAttribute("help-icon") ? this.getAttribute("help-icon") : "/static/img/question-mark.png"}"
            ></vis-control>
        `;
    }
}

customElements.define("graph-creator", GraphCreator);
