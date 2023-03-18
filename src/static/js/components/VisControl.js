class VisControl extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    get delete() {
        return this.hasAttribute("delete");
    }

    observedAttributes() {
        return ["delete"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (newValue) {
            case "delete":
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
                this.delete
                    ? `<button id="delete-btn" class="button">
                    <img class="button__image" src="/static/img/delete-icon.png" />
                </button>`
                    : ""
            }
                <button id="center-btn" class="button">
                    <img class="button__image" src="/static/img/center-icon.png" />
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
    }
}

customElements.define("vis-control", VisControl);
