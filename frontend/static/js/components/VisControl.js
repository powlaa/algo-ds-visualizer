class VisControl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
        this.shadowRoot.querySelector("#center-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent("center"));
        });
    }

    observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {}

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                }
                .button {
                    font-size: 1em;
                    text-align: center;
                    cursor: pointer;
                    background-color: rgb(255 255 255);
                    border: 1px solid black;
                    border-radius: 100%;
                    height: 30px;
                    width: 30px;
                    margin-left: 5px;
                    padding: 2px 0 0 2px;
                }
                .button__image {
                    height: 18px;
                }
            </style>
            <div class="container">
                <button id="center-btn" class="button">
                    <img class="button__image" src="/static/img/center-icon.png" />
                </button>
            </div>
        `;
    }
}

customElements.define("vis-control", VisControl);
