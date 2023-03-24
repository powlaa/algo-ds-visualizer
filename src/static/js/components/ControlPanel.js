class ControlPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    get data() {
        return this._data || [];
    }

    set data(d) {
        this._data = d;
        this._render();
        this._addEventListeners();
    }

    _addEventListeners() {
        this.data.forEach((method, index) => {
            this.shadowRoot.querySelector(`#method-${method.name}-${index}`).addEventListener("click", () => {
                const params = {};
                method.parameters.forEach((param) => {
                    const input = this.shadowRoot.querySelector(`#input-${method.name}-${param.name}`);
                    params[param.name] = input.value;
                    input.value = null;
                });

                this.dispatchEvent(
                    new CustomEvent("call-method", {
                        detail: {
                            method: method.name,
                            params,
                        },
                    })
                );
            });
        });
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    height: calc(100% - 20px);
                    display: grid;
                    width: 100%;
                    align-items: center;
                    user-select: none;
                    padding: 15px 0 5px 0;
                }
                .method {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    direction: rtl;
                }
                .method__input-container {
                    position: relative;
                    margin: 0 5px
                }
                .method__input-label {
                    display: block;
                    font-size: 0.95em;
                    position: absolute;
                    top: -1.1em;
                    left: 3px;
                }
                .method__input {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    border: 3px solid #ccc;
                    -webkit-transition: 0.5s;
                    transition: 0.5s;
                    outline: none;
                    direction: ltr;
                }
                .method__input:focus {
                    border: 3px solid #555;
                }
                .method__button {
                    font-size: 1em;
                    text-align: center;
                    background-color: var(--primary-background-color, #03a688);
                    border: none;
                    color: var(--primary-color, white);
                    padding: 8px 18px;
                    text-decoration: none;
                    display: inline-block;
                    cursor: pointer;
                    margin: 0 5px;
                }
            </style>
            <div class="container">
                ${this.data
                    .map(
                        (el, index) =>
                            `<div class="method">
                            <button class="method__button" id="method-${el.name}-${index}">${el.name}</button>
                            ${el.parameters
                                .map(
                                    (param) =>
                                        `<div class="method__input-container">
                                        <label class="method__input-label" for="input-${el.name}-${param.name}">${param.name}</label>
                                        <input class="method__input" type="${param.type}" ${
                                            param.type === "number" ? `min="${param.min}"` : ""
                                        } id="input-${el.name}-${param.name}" name="input-${el.name}-${param.name}">
                                        </div>`
                                )
                                .join("")}
                        </div>`
                    )
                    .join("")}
            </div>
        `;
    }
}

customElements.define("control-panel", ControlPanel);
