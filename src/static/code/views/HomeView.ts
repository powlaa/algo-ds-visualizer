import linkedList from "../../img/linked-list.png";
import heapSort from "../../img/heapsort.png";
import quickSort from "../../img/quicksort.png";
import dijkstra from "../../img/dijkstra.png";
import aStar from "../../img/astar.png";

class HomeView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._render();
  }

  _render() {
    this.shadowRoot!.innerHTML = `
            <style>
                .layout {
                    --split-layout-justify-content-left: none;
                    --split-layout-justify-content-right: none;
                    --split-layout-height: calc(100% - 130px);
                    --split-layout-resizer-border: 5px solid #80808030;
                }
                .content__left {
                    width: 100%;
                }
                .content__right {
                    width: 100%;
                }
                .category {
                    border-bottom: 1px solid #80808036;
                    width: calc(100% - 20px);
                    padding: 10px;
                }
                .ds-item {
                    margin: 10px;
                }
            </style>
            <header-element title="Algorithm and Data Structure Visualizer" no-start-btn title-big></header-element>
            <split-layout class="layout">
                <div slot="left" class="content__left">
                    <category-card
                        class="category"
                        title="Sorting algorithms"
                        description="Sorting algorithms are algorithms that put a collection of items into a certain order."
                    >
                        <nav-item title="Heapsort" img=${heapSort} link="/heapsort"></nav-item>
                        <nav-item title="Quicksort" img=${quickSort} link="/quicksort"></nav-item>
                    </category-card>
                    <category-card
                        class="category"
                        title="Pathfinding algorithms"
                        description="Pathfinding algorithms are a set of techniques used to find the shortest path between two points in a graph or network."
                    >
                        <nav-item title="Dijkstra" img=${dijkstra} link="/dijkstra"></nav-item>
                        <nav-item title="A*" img=${aStar} link="/astar"></nav-item>
                    </category-card>
                </div>
                <div slot="right" class="content__right">
                    <category-card
                        class="category"
                        title="Data structures"
                        description="Data structures are a way of organizing data in a computer so that it can be used efficiently."
                    >
                        <nav-item class="ds-item" title="Linked List" img=${linkedList} link="/linkedlist"></nav-item>
                    </category-card>
                </div>
            </split-layout>
        `;
  }
}

customElements.define("home-view", HomeView);
