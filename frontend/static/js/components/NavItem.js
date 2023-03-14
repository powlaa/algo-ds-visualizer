class NavItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    observedAttributes() {
        return ["title", "img", "link"];
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
                    box-shadow: 4px 4px 7px rgb(0 0 0 / 20%);
                    border-radius: 8px;
                    padding: 5px 10px;
                    cursor: pointer;
                }
                a {
                    all: unset;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
                img {
                    max-width: 100%;
                    max-height: 100px;
                    height: 100px;
                }
                .title {
                    font-size: 1.5em;
                    width: 100%;
                    margin: 10px 0;
                }
            </style>
            <div class="container">
                <a href="${this.getAttribute("link")}" class="nav__link" data-link>
                    <img src="${this.getAttribute("img")}" />
                    <h1 id="title" class="title">${this.getAttribute("title")}</h1>
                </a>
            </div>
        `;
    }
}

customElements.define("nav-item", NavItem);
