class HomeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .title {
                    text-align: center;
                    font-size: 2em;
                    text-transform: uppercase;
                    width: 100%;
                    margin: 0;
                    padding: 10px 0;
                }
                .title--big {
                    font-size: 4em;
                    padding: 30px 0;
                }
                .container {
                    display: flex;
                    justify-content: space-around;
                }
                .layout {
                    --split-layout-justify-content-left: none;
                    --split-layout-justify-content-right: none;
                    --split-layout-height: none;
                }
                .content__left {
                    width: 100%;
                }
                .content__right {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
                .category {
                    border-top: 1px solid black;
                    width: calc(100% - 20px);
                    padding: 10px;
                }
                .ds-item {
                    margin: 10px;
                }
            </style>
            <h1 class="title title--big">Visualizer</h1>
            <div class="container">
                <h1 class="title">Algo</h1>
                <h1 class="title">DS</h1>
            </div>
            <split-layout class="layout">
                <div slot="left" class="content__left">
                    <category-card
                        class="category"
                        title="Sorting algorithms"
                        description="Sorting algorithms are algorithms that put a collection of items into a certain order."
                    >
                        <nav-item title="Heapsort" img="/static/img/heapsort.png" link="/heapsort"></nav-item>
                    </category-card>
                    <category-card
                        class="category"
                        title="Pathfinding algorithms"
                        description="Pathfinding algorithms are a set of techniques used to find the shortest path between two points in a graph or network."
                    >
                        <nav-item title="Dijkstra" img="/static/img/dijkstra.png" link="/dijkstra"></nav-item>
                    </category-card>
                </div>
                <div slot="right" class="content__right">
                    <nav-item class="ds-item" title="Linked List" img="/static/img/linked-list.png" link="/linkedlist"></nav-item>
                </div>
            </split-layout>
        `;
    }
}

customElements.define("home-view", HomeView);
