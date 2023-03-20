class VisControl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    get delete() {
        return this.hasAttribute("del");
    }

    get help() {
        return this.hasAttribute("help");
    }

    observedAttributes() {
        return ["del", "help"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (newValue) {
            case "del":
                this._render();
                break;
            case "help":
                this._render();
                break;
        }
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                    user-select: none;
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
                    margin-top: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .button__image {
                    height: 18px;
                }
            </style>
            <div class="container">
            ${
                this.help
                    ? `<button id="help-btn" class="button">
                    <img class="button__image" src="${this.getAttribute("help-icon")}" />
                </button>`
                    : ""
            }
            ${
                this.delete
                    ? `<button id="delete-btn" class="button">
                    <img class="button__image" src="${this.getAttribute("delete-icon")}" />
                </button>`
                    : ""
            }
                <button id="center-btn" class="button">
                    <img class="button__image" src="${this.getAttribute("center-icon")}" />
                </button>
            </div>
        `;
        this.shadowRoot.querySelector("#center-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            this.dispatchEvent(new CustomEvent("center"));
        });
        if (this.delete)
            this.shadowRoot.querySelector("#delete-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent("delete", { bubbles: true, composed: true }));
            });
        if (this.help)
            this.shadowRoot.querySelector("#help-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                this.dispatchEvent(new CustomEvent("help", { bubbles: true, composed: true }));
            });
    }
}

customElements.define("vis-control", VisControl);
