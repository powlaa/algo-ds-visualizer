class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._heading = this.shadowRoot.querySelector("#heading");
        this._description = this.shadowRoot.querySelector("#description");
        this._informationPopup = this.shadowRoot.querySelector("#information-popup");

        if (!this.hasAttribute("no-start-btn")) this.shadowRoot.querySelector("#start-btn").addEventListener("click", this._start.bind(this));
        this.shadowRoot.querySelector("#information-btn").addEventListener("click", () => {
            this._informationPopup.show();
        });
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
        this.dispatchEvent(new CustomEvent("start", { detail: { array } }));
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/static/css/index.css" />
            <style>
                .container {
                    width: 100%;
                    height: 100px;
                    background-color: #ced0c1;
                    display: flex;
                    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.3);
                }
                .panel {
                    margin: 0 10px;
                }
                .panel__title {
                    display: flex;
                    align-items: center;
                    white-space: nowrap;
                }
                .panel__button {
                    font-size: 1em;
                    text-align: center;
                    cursor: pointer;
                }
                .panel__button--information {
                    background-color: rgba(0, 0, 0, 0);
                    border: 1px solid black;
                    border-radius: 100%;
                    height: 1.4em;
                    width: 1.4em;
                    font-weight: bold;
                    margin-left: 5px;
                    padding-top: 2px;
                }
                .panel__button--start {
                    background-color: #03a688; /* Green */
                    border: none;
                    color: white;
                    padding: 8px 18px;
                    text-decoration: none;
                    display: inline-block;
                }
                .panel__input {
                    display: flex;
                }
                .explanations {
                    margin: 0 20px;
                    width: 100%;
                    text-align: center;
                }
                .explanations__description {
                    font-size: 1.2em;
                    font-style: italic;
                }
            </style>
            <div class="container">
                <div class="panel">
                    <div class="panel__title">
                        <h2>${this.getAttribute("title")}</h2>
                        <button id="information-btn" class="panel__button panel__button--information">i</button>
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
                </div>
            </div>
        `;
    }
}

customElements.define("header-element", Header);
