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
                    background-color: #80808025;
                }
                .container:hover {
                    background-color: #80808029;
                }
                a {
                    all: unset;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
                .img__container {
                    border: 1px solid #ccc;
                    pointer-events: none;
                    background-color: white;
                    width: 100%;
                    height: 100px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .img {
                    max-height: 100px;
                    pointer-events: none;
                }
                .title {
                    font-size: 1.5em;
                    width: 100%;
                    margin: 10px 0;
                    pointer-events: none;
                }
            </style>
            <div class="container">
                <a href="${this.getAttribute("link")}" class="nav__link" data-link>
                    <div class="img__container">
                        <img class="img" src="${this.getAttribute("img")}" />
                    </div>
                    <h1 id="title" class="title">${this.getAttribute("title")}</h1>
                </a>
            </div>
        `;
    }
}

customElements.define("nav-item", NavItem);
