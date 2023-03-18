class CategoryCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    observedAttributes() {
        return ["title", "description"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this._render();
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                    padding: 10px;
                }
                .title {
                    font-size: 2em;
                    width: 100%;
                    margin: 10px 0;
                }
                .description {
                }
                .items {
                    margin-top: 15px;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                }
            </style>
            <div class="container">
                <h1 id="title" class="title">${this.getAttribute("title")}</h1>
                <span id="description" class="description">${this.getAttribute("description")}</span>
                <div class="items">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define("category-card", CategoryCard);
