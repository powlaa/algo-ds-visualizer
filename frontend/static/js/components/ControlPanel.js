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
                    new CustomEvent(method.name, {
                        detail: {
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
                    height: 100%;
                    display: flex;
                    width: 100%;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                }
                .method {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .method__input-container {
                    position: relative;
                }
                .method__input-label {
                    display: block;
                    font-size: 0.8em;
                    position: absolute;
                    top: -1.1em;
                    left: 3px;
                }
                .method__input {
                    min-width: 20px;
                    max-width: 50px;
                    height: 100%;
                    margin-right: 5px;
                    box-sizing: border-box;
                    border: 3px solid #ccc;
                    -webkit-transition: 0.5s;
                    transition: 0.5s;
                    outline: none;
                }
                .method__input:focus {
                    border: 3px solid #555;
                }
                .method__button {
                    font-size: 1em;
                    text-align: center;
                    background-color: #03a688; /* Green */
                    border: none;
                    color: white;
                    padding: 8px 18px;
                    text-decoration: none;
                    display: inline-block;
                    cursor: pointer;
                }
            </style>
            <div class="container">
                ${this.data
                    .map(
                        (el, index) =>
                            `<div class="method">
                            ${el.parameters
                                .map(
                                    (param) =>
                                        `<div class="method__input-container">
                                        <label class="method__input-label" for="input-${el.name}-${param.name}">${param.name}</label>
                                        <input class="method__input" type="${param.type}" id="input-${el.name}-${param.name}" name="input-${el.name}-${param.name}" placeholder="${param.name}">
                                        </div>`
                                )
                                .join("")}
                                <button class="method__button" id="method-${el.name}-${index}">${el.name}</button>
                        </div>`
                    )
                    .join("")}
            </div>
        `;
    }
}

customElements.define("control-panel", ControlPanel);
