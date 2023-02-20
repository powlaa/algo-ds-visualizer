class LinkedListView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <h1>Linked List</h1>
        `;
    }
}

customElements.define("linked-list-view", LinkedListView);
