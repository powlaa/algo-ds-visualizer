class ArrayDisplay extends HTMLElement {
    _renderCounter = 0;

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
    }

    highlight(...indices) {
        indices.forEach((index) => {
            this._changeModifier(index, "highlight");
        });
    }

    mark(...indices) {
        indices.forEach((index) => {
            this._changeModifier(index, "mark");
        });
    }

    lock(...indices) {
        indices.forEach((index) => {
            this._changeModifier(index, "lock");
        });
    }

    _changeModifier(index, modifier) {
        const el = this.shadowRoot.querySelector("#array-element-" + index);
        el.className = "array__element";
        el.classList.add("array__element--" + modifier);
    }

    async swap(index_A, index_B, duration) {
        const renderCounter = this._renderCounter;
        const temp = this.data[index_A];
        this.data[index_A] = this.data[index_B];
        this.data[index_B] = temp;

        await this._wait(duration);
        if (renderCounter != this._renderCounter) return;

        this._render();
    }

    _render() {
        this._renderCounter++;
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/static/css/index.css" />
            <script src="/static/js/mixins/wait-mixin.js"></script>
            <style>
                :host {
                    display: inline-block;
                }
                .array {
                    margin: 30px 30px 30px 30px;
                    text-align: center;
                    font-size: 2em;
                    width: calc(100% - 60px);
                    display: flex;
                    justify-content: stretch;
                }
                .array__element {
                    border: 1px solid black;
                    padding: 2px 5px;
                    flex: 1;
                }
                .array__element--mark {
                    background-color: var(--array-mark-background-color, #d2898d);
                }
                .array__element--highlight {
                    background-color: var(--array-highlight-background-color, #85d298);
                }
                .array__element--lock {
                    background-color: var(--array-lock-background-color, #b9b9b9);
                }
            </style>
            <div id="array" class="array">${
                this._data
                    ?.map(
                        (el, index) =>
                            `<span id="array-element-${index}" class="array__element ${el.modifier ? "array__element--" + el.modifier : ""}">${
                                el.value
                            }</span>`
                    )
                    .join("") ?? ""
            }</div>
        `;
    }
}

Object.assign(ArrayDisplay.prototype, waitMixin);

customElements.define("array-display", ArrayDisplay);
