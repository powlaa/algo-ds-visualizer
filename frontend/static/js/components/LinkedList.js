class LinkedList extends HTMLElement {
    _MARGIN = { top: 50, right: 20, bottom: 30, left: 20 };
    _E_WIDTH = { singly: 75 };
    _E_HEIGHT = 50;
    _SPACING = 30;
    _Y_OFFSET = 80;
    _linkedList = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
        this._container = this.shadowRoot.querySelector("#container");
        this._svg = d3
            .select(this.shadowRoot.querySelector("#container"))
            .append("svg")
            // Responsive SVG needs these 2 attributes and no width and height attr.
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${this._container.offsetWidth} ${this._container.offsetHeight}`)
            // Class to make it responsive.
            .classed("svg-content-responsive", true);

        this._g = this._svg.append("g").attr("transform", "translate(" + this._MARGIN.left + "," + this._MARGIN.top + ")");
        this._initLinkedList();
    }

    get data() {
        return this._linkedList || [];
    }

    set data(d) {
        this._linkedList = this._addCoordinatesToLinkedList(d);
    }

    highlightLinks(...indices) {
        this._g.selectAll(".link--highlight").attr("marker-end", "url(#arrow)").classed("link--highlight", false);
        indices.forEach(({ source, target }) =>
            this._g.select(`#link-${source}-${target}`).attr("marker-end", "url(#arrow-highlight)").classed("link--highlight", true)
        );
    }

    highlightElements(...indices) {
        this._g.selectAll(".element--highlight").classed("element--highlight", false);
        indices.forEach((index) => this._g.select("#element-" + index).classed("element--highlight", true));
    }

    center(duration) {
        return this._g.transition().duration(duration).attr("transform", this._getCenterTranslate(this._linkedList.length)).end();
    }

    reset() {
        this._currentElement.style("display", "none");
        this._currentLink.style("display", "none");
        this.highlightLinks();
        this.highlightElements();
    }

    async updateLinkedList(duration) {
        this._updateElements(this._linkedList, duration);

        this._updateLinks(this._linkedList, duration);

        await this._updateHead(this._linkedList, duration);
    }

    async setCurrentPointer(index, duration, showIndex) {
        if (index >= this._linkedList.length) return;

        this._currentElement.interrupt();
        this._currentLink.interrupt();

        if (this._currentElement.node().style.display === "none") {
            //if current Element and link are not visible, make them visible
            this._currentElement
                .attr("x", this._linkedList[index].x)
                .attr("y", this._linkedList[index].y + this._Y_OFFSET)
                .style("text-anchor", "middle")
                .style("display", "block")
                .text(showIndex ? `current (i: ${index})` : "current");
            this._currentLink
                .style("display", "block")
                .attr(
                    "d",
                    `M${this._linkedList[index].x},${this._linkedList[index].y + this._Y_OFFSET - 13}L${this._linkedList[index].x},${
                        this._linkedList[index].y + this._E_HEIGHT / 2
                    }`
                );
        } else {
            //if current element and link are visible, move arrow to correct location in transition, then transition the rest
            let d = this._currentLink.attr("d");
            d = d.substr(0, d.indexOf("L"));
            await this._currentLink
                .transition()
                .duration(duration / 3)
                .attr("d", `${d}L${this._linkedList[index].x},${this._linkedList[index].y + this._E_HEIGHT / 2}`)
                .end();

            this._currentElement
                .text(showIndex ? `current (i: ${index})` : "current")
                .transition()
                .duration(duration / 3)
                .attr("x", this._linkedList[index].x)
                .attr("y", this._linkedList[index].y + this._Y_OFFSET);
            await this._currentLink
                .transition()
                .duration(duration / 3)
                .attr(
                    "d",
                    `M${this._linkedList[index].x},${this._linkedList[index].y + this._Y_OFFSET - 13}L${this._linkedList[index].x},${
                        this._linkedList[index].y + this._E_HEIGHT / 2
                    }`
                )
                .end();
        }
    }

    async addElement(data, id, index, duration) {
        if (index === 0) return this._addNewHead(data, id, duration);
        if (index > this._linkedList.length) return;

        //move all elements after index and index to the right
        const moveAmount = this._SPACING + this._E_WIDTH.singly;
        this._element
            .transition()
            .duration(duration / 2)
            .attr("transform", (d, i) => {
                if (i < index) return `translate(${d.x},${d.y})`;
                return "translate(" + (d.x + moveAmount) + "," + d.y + ")";
            });
        this._nullElement
            .transition()
            .duration(duration / 2)
            .attr("x", (d) => d.x + moveAmount)
            .attr("y", (d) => d.y);
        await this._link
            .transition()
            .duration(duration / 2)
            .attr("transform", (d, i) => {
                if (i < index) return "translate(0,0)";
                return `translate(${moveAmount},0)`;
            })
            .attrTween("d", (d, i, paths) => {
                const previous = d3.select(paths[i]).attr("d");
                if (i !== index - 1) return d3.interpolatePath(previous, previous);
                let current = "";
                if (i + 1 >= this._linkedList.length)
                    current = d3.line()([
                        [d.x + this._E_WIDTH.singly / 2, d.y],
                        [d.x + this._SPACING + (2 * this._E_WIDTH.singly) / 3 + moveAmount, d.y],
                    ]);
                else
                    current = d3.line()([
                        [d.x + this._E_WIDTH.singly / 2, d.y],
                        [this._linkedList[i + 1].x - this._E_WIDTH.singly / 3 + moveAmount, this._linkedList[i + 1].y],
                    ]);
                return d3.interpolatePath(previous, current);
            })
            .end();

        this._linkedList.splice(index, 0, { data, id });
        this._linkedList = this._addCoordinatesToLinkedList(this._linkedList);
        this._linkedList[index].y = this._linkedList[index].y - this._E_HEIGHT * 0.75;
        //add new element
        this._updateElements(this._linkedList);

        //update only the new link
        await this._updateLinks(this._linkedList, duration / 2, [index]);
    }

    async moveLink({ source, target, newTarget }, duration) {
        const link = this._svg.select(`path#link-${source}-${target}`);

        if (newTarget < this._linkedList.length) {
            const targetElement = this._linkedList[newTarget];
            if (source === "head" || target === "head")
                await link
                    .transition()
                    .duration(duration)
                    .attr("d", (d) =>
                        d3.line()([
                            [d.x, d.y],
                            [this._SPACING * 2 + this._E_WIDTH.singly, this._linkedList[0].y - this._E_HEIGHT / 2],
                        ])
                    )
                    .end();
            else
                await link
                    .transition()
                    .duration(duration)
                    .attrTween("d", (d, i, paths) => {
                        const previous = d3.select(paths[i]).attr("d");
                        const current = d3.line()([
                            [d.x + this._E_WIDTH.singly / 2, d.y],
                            [d.x + this._E_WIDTH.singly, d.y - this._E_HEIGHT],
                            [targetElement.x - (5 * this._E_WIDTH.singly) / 6, d.y - this._E_HEIGHT],
                            [targetElement.x - this._E_WIDTH.singly / 3, targetElement.y - 5],
                        ]);
                        return d3.interpolatePath(previous, current);
                    })
                    .end();
        } else {
            //newTarget is nullElement
            if (source === "head" || target === "head")
                await link
                    .transition()
                    .duration(duration)
                    .attrTween("d", (d, i, paths) => {
                        const previous = d3.select(paths[i]).attr("d");
                        const current = d3.line()([
                            [d.x, d.y],
                            [this._nullElement.attr("x") - 3, this._nullElement.attr("y") - 27],
                        ]);
                        return d3.interpolatePath(previous, current);
                    })
                    .end();
            else
                await link
                    .transition()
                    .duration(duration)
                    .attrTween("d", (d, i, paths) => {
                        const previous = d3.select(paths[i]).attr("d");
                        const current = d3.line()([
                            [d.x + this._E_WIDTH.singly / 2, d.y],
                            [d.x + this._E_WIDTH.singly, d.y - this._E_HEIGHT],
                            [this._nullElement.attr("x") - (5 * this._E_WIDTH.singly) / 6, d.y - this._E_HEIGHT],
                            [this._nullElement.attr("x") - 15, this._nullElement.attr("y") - 15],
                        ]);
                        return d3.interpolatePath(previous, current);
                    })
                    .end();
        }
    }

    _initLinkedList() {
        this._svg
            .append("defs")
            .append("marker")
            .attr("id", "arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("refX", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("stroke", "black");

        this._svg
            .append("defs")
            .append("marker")
            .attr("id", "arrow-highlight")
            .attr("viewBox", "0 -5 10 10")
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("refX", 10)
            .attr("orient", "auto-start-reverse")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("stroke", "red")
            .attr("fill", "red");

        this._element = this._g.append("g").selectAll("g");
        this._link = this._g.append("g").selectAll("g");
        this._nullElement = this._g.append("text").attr("class", "element__null");
        this._headElement = this._g.append("text").attr("class", "element__head");
        this._headLink = this._g.append("path").attr("id", "link-head-0").attr("class", "link link--head").attr("marker-end", "url(#arrow)");
        this._currentElement = this._g.append("text").attr("class", "element__current").style("display", "none");
        this._currentLink = this._g
            .append("path")
            .attr("class", "link link--current")
            .attr("marker-end", "url(#arrow-highlight)")
            .style("display", "none");

        // listen for dragging
        var dragSvg = d3
            .zoom()
            .on("zoom", (e) => this._g.attr("transform", e.transform))
            .on("start", () => d3.select("body").style("cursor", "move"))
            .on("end", () => d3.select("body").style("cursor", "auto"));

        this._svg.call(dragSvg).on("dblclick.zoom", null);
    }

    async _updateElements(linkedList, duration) {
        var element = this._element.data(linkedList, (d) => d.id);
        element.exit().remove();

        this._nullElement.data([this._getNullElementPosition(linkedList)]);

        this._nullElement
            .transition()
            .duration(duration)
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .style("text-anchor", "middle")
            .text("∅");

        // adds new elements as a group and updates transform for all
        const elementG = element.enter().append("g").attr("class", "element");
        this._element = elementG.merge(element).attr("id", (d, i) => "element-" + i);
        await this._element
            .transition()
            .duration(duration)
            .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
            .end();

        // adds the rect to the element
        elementG
            .append("rect")
            .attr("class", "element__rect")
            .attr("transform", `translate(-${this._E_WIDTH.singly / 3}, -${this._E_HEIGHT / 2})`);

        elementG
            .append("rect")
            .attr("class", "element__rect element__rect--link")
            .attr("transform", `translate(${this._E_WIDTH.singly / 3}, -${this._E_HEIGHT / 2})`);

        // adds the text to the element
        elementG
            .append("text")
            .attr("dy", ".30em")
            .attr("class", "element__data")
            .style("text-anchor", "middle")
            .text((d) => d.data);
    }

    async _updateLinks(linkedList, duration, indicesToUpdate) {
        var link = this._link.data(linkedList, (d) => d.id);
        link.exit().remove();

        // adds the links between the nodes
        this._link = link
            .enter()
            .append("path")
            .attr("marker-end", "url(#arrow)")
            .attr("class", "link")
            .merge(link)
            .attr("id", (d, i) => `link-${i}-${i + 1}`);
        await this._link
            .transition()
            .duration(duration)
            .attr("transform", (d, i, paths) => {
                if (!indicesToUpdate || (indicesToUpdate && indicesToUpdate.includes(i))) return "translate(0,0)";
                return paths[i].getAttribute("transform");
            })
            .attrTween("d", (d, i, paths) => {
                const previous = d3.select(paths[i]).attr("d");
                if (indicesToUpdate && !indicesToUpdate.includes(i)) return d3.interpolatePath(previous, previous);
                let current = "";
                if (i + 1 >= linkedList.length)
                    current = d3.line()([
                        [d.x + this._E_WIDTH.singly / 2, d.y],
                        [this._getNullElementPosition(this._linkedList).x - this._E_WIDTH.singly / 3 + 10, this._Y_OFFSET],
                    ]);
                else
                    current = d3.line()([
                        [d.x + this._E_WIDTH.singly / 2, d.y],
                        [linkedList[i + 1].x - this._E_WIDTH.singly / 3, linkedList[i + 1].y],
                    ]);
                return d3.interpolatePath(previous, current);
            })
            .end();
    }

    async _updateHead(linkedList, duration) {
        // if (linkedList.length == 0) return;
        this._headElement.transition().duration(duration).attr("x", this._SPACING).attr("y", 0).style("text-anchor", "middle").text("head");
        let target = [this._SPACING, this._Y_OFFSET - 18];
        if (linkedList.length > 0) target = [this._SPACING, linkedList[0].y - this._E_HEIGHT / 2];
        await this._headLink
            .data([{ x: this._SPACING, y: 5 }])
            .transition()
            .duration(duration)
            .attrTween("d", (d, i, paths) => {
                const previous = d3.select(paths[i]).attr("d");
                const current = d3.line()([[d.x, d.y], target]);
                return d3.interpolatePath(previous, current);
            })
            .end();
    }

    async _addNewHead(data, id, duration) {
        //move all elements to the right except the head pointer
        const moveAmount = this._SPACING + this._E_WIDTH.singly;
        this._element
            .transition()
            .duration(duration / 2)
            .attr("transform", (d) => "translate(" + (d.x + moveAmount) + "," + d.y + ")");
        this._nullElement
            .transition()
            .duration(duration / 2)
            .attr("x", (d) => d.x + moveAmount - (this._linkedList.length === 0 ? 10 : 0))
            .attr("y", (d) => d.y);
        this._link
            .transition()
            .duration(duration / 2)
            .attr("transform", `translate(${moveAmount},0)`);
        await this._headLink
            .transition()
            .duration(duration / 2)
            .attr("d", `M${this._SPACING},5L${this._SPACING + moveAmount},${this._Y_OFFSET - this._E_HEIGHT / 2}`)
            .end();

        this._linkedList.unshift({ data, id });
        this._linkedList = this._addCoordinatesToLinkedList(this._linkedList);
        //add new element
        this._updateElements(this._linkedList);

        await this._wait(duration / 2);

        //add new link
        this._updateLinks(this._linkedList);
    }

    _getCenterTranslate(linkedListLength) {
        const listWidth = linkedListLength * this._E_WIDTH.singly + (linkedListLength + 2) * this._SPACING;
        return "translate(" + (this._MARGIN.left + (this._container.offsetWidth - listWidth) / 2) + "," + this._MARGIN.top + ")";
    }

    _addCoordinatesToLinkedList(linkedList) {
        return linkedList.map((element, index) => {
            return { ...element, y: this._Y_OFFSET, x: index * this._E_WIDTH.singly + this._SPACING * (index + 1) };
        });
    }

    _getNullElementPosition(linkedList) {
        const lastIndex = linkedList.length - 1;
        if (linkedList.length === 0) return { x: this._SPACING, y: this._Y_OFFSET + 9 };
        return { x: linkedList[lastIndex].x + this._SPACING + this._E_WIDTH.singly - 10, y: this._Y_OFFSET + 9 };
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/static/css/index.css" />
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                    height: 100%;
                    user-select: none;
                }
                .svg-content-responsive {
                    display: inline-block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                }
                .element--highlight > .element__rect:first-of-type {
                    fill: #D2898D;
                }
                .element__null {
                    font-size: 2em;
                }
                .element__rect {
                    fill: white;
                    stroke: black;
                    width: 50px;
                    height: 50px;
                }
                .element__rect--link {
                    width: 25px;
                }
                .element__head--highlight{
                    fill: red;
                }
                .link {
                    fill: none;
                    stroke: black;
                    stroke-width: 2px;
                }
                .link--highlight {
                    stroke: red;
                }
                .link--current {
                    stroke: red;
                }
            </style>
            <div id="container" class="container"></div>
        `;
    }
}

Object.assign(LinkedList.prototype, waitMixin);

customElements.define("linked-list", LinkedList);
