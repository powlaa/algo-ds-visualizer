class Header extends HTMLElement {
    _startEvent = (array) => new CustomEvent("start", { bubbles: true, composed: true, detail: { array } });
    _codeEvent = () => new CustomEvent("code", { bubbles: true, composed: true });

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._heading = this.shadowRoot.querySelector("#heading");
        this._description = this.shadowRoot.querySelector("#description");
        this._informationPopup = this.shadowRoot.querySelector("#information-popup");

        if (!this.hasAttribute("no-start-btn")) this.shadowRoot.querySelector("#start-btn").addEventListener("click", this._start.bind(this));
        if (!this.hasAttribute("title-big")) {
            this.shadowRoot.querySelector("#information-btn").addEventListener("click", () => {
                this._informationPopup.show();
            });
            this.shadowRoot.querySelector("#code-btn").addEventListener("click", () => this.dispatchEvent(this._codeEvent()));
        }
    }

    static get observedAttributes() {
        return ["heading", "description", "popup-template-id"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "heading":
                this._heading.innerText = newValue;
                break;
            case "description":
                this._description.innerText = newValue;
                break;
            case "popup-template-id":
                this._informationPopup.setAttribute("template-id", newValue);
                break;
        }
    }

    _start() {
        let array = [];
        array = this.shadowRoot
            .querySelector("#array-input")
            .value.split(",")
            .map((e) => parseInt(e))
            .filter((e) => !isNaN(e));
        this.dispatchEvent(this._startEvent(array));
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                h2 {
                    font-weight: 500;
                    margin: 15px 0 6px 0;
                    font-size: 1.8em;
                }
                .container {
                    width: 100%;
                    height: 130px;
                    background-color: var(--header-background-color, #ced0c1);
                    display: flex;
                    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
                    color: var(--header-color, black);
                }
                .title {
                    width: 100%;
                    align-items: center;
                    display: flex;
                    justify-content: center;
                    font-size: 2.5em;
                }
                .panel {
                    margin: 0 10px;
                }
                .panel__title {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                    margin: 5px 0 10px 0;
                }
                .link__image {
                    margin: 15px 5px 6px 0;
                    height: 1.8em;
                    pointer-events: none;
                }
                .panel__button {
                    font-size: 1em;
                    text-align: center;
                    cursor: pointer;
                }
                .panel__button--icon {
                    background-color: rgb(255 255 255);
                    border: 1px solid black;
                    border-radius: 100%;
                    height: 30px;
                    width: 30px;
                    margin-left: 5px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .panel__button--start {
                    background-color: var(--primary-background-color, #03a688);
                    border: none;
                    color: var(--primary-color, white);
                    padding: 8px 18px;
                    text-decoration: none;
                    display: inline-block;
                }
                .button__image {
                    max-height: 18px;
                    max-width: 20px;
                }
                .panel__input {
                    display: flex;
                }
                .explanations {
                    margin: 0 0 0 5%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .explanations__heading {
                    font-weight: 500;
                    font-size: 2.2em;
                    margin: 0 0 6px 0;
                }
                .explanations__description {
                    font-size: 1.4em;
                    font-style: italic;
                }
            </style>
            <div class="container">
            ${
                this.hasAttribute("title-big")
                    ? `<div class="title">${this.getAttribute("title")}</div>`
                    : `<div class="panel">
                    <div class="panel__title">
                        <a href="/" data-link><img class="link__image" src="${this.getAttribute("home-icon")}" /></a>
                        <h2>${this.getAttribute("title")}</h2>
                        <button id="information-btn" class="panel__button panel__button--icon">
                            <img class="button__image" src="${this.getAttribute("information-icon")}" />
                        </button>
                        <button id="code-btn" class="panel__button panel__button--icon">
                            <img class="button__image" src="${this.getAttribute("code-icon")}" />
                        </button>
                        <pop-up id="information-popup" overlay></pop-up>
                    </div>
                    <div class="panel__input">
                        <input
                            type="text"
                            id="array-input"
                            style="display: ${this.getAttribute("array-input") ?? "none"}"
                            placeholder="e.g. 5,3,7,11,9,4,2"
                        />
                        ${
                            this.hasAttribute("no-start-btn")
                                ? ""
                                : `<button id="start-btn" class="panel__button panel__button--start">${
                                      this.getAttribute("start-btn-name") ?? "Start"
                                  }</button>`
                        }
                    </div>
                </div>
                <div class="explanations">
                    <h1 id="heading" class="explanations__heading"></h1>
                    <div id="description" class="explanations__description"></div>
                </div>`
            }
            </div>
        `;
    }
}

customElements.define("header-element", Header);
