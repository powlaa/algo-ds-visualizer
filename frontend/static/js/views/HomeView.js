class HomeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <h1>Home</h1>
            <nav class="nav">
                <a href="/" class="nav__link" data-link>Startseite</a>
                <a href="/heapsort" class="nav__link" data-link>Heapsort</a>
                <a href="/dijkstra" class="nav__link" data-link>Dijkstra</a>
                <a href="/linkedlist" class="nav__link" data-link>Linked List</a>
            </nav>
        `;
    }
}

customElements.define("home-view", HomeView);
