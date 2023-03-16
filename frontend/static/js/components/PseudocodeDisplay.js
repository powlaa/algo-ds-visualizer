class PseudocodeDisplay extends HTMLElement {
    _code = [];
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();
    }

    set code(code) {
        this._code = code;
        console.log(this._code);
        this._render();
    }

    get code() {
        return this._code;
    }

    highlightLine(...labels) {
        this.shadowRoot.querySelectorAll(`.code__line--highlighted`).forEach((e) => e.classList.remove("code__line--highlighted"));
        labels.forEach((label) => this.shadowRoot.querySelector(`#${label}`)?.classList.add("code__line--highlighted"));
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .code {
                    user-select: none;
                }
                .code__line {
                    padding-left: 1em;
                    display: flex;
                    align-items: baseline;
                }
                .code__line:nth-child(even) {
                    background-color: #80808029;
                }
                .code__line:hover {
                    background-color: #80808036;
                }
                .code__line--highlighted {
                    background-color: var(--pseudocode-highlight-background-color, greenyellow) !important;
                }
                .code__line--highlighted:nth-child(even) {
                    background-color: var(--pseudocode-highlight-background-color-alternate, green) !important;
                }
                .code__number {
                    margin-right: 1em;
                    border-right: 2px solid #80808036;
                    width: 2em;
                }
                .code__text {
                    display: block;
                    font-size: 1em;
                }
                .code__text--indent-0 {
                    margin-left: 0;
                }
                .code__text--indent-1 {
                    margin-left: 1em;
                }
                .code__text--indent-2 {
                    margin-left: 2em;
                }
                .code__text--indent-3 {
                    margin-left: 3em;
                }
                .code__text--indent-4 {
                    margin-left: 4em;
                }
                .code__text--indent-5 {
                    margin-left: 5em;
                }
                .code__text--indent-6 {
                    margin-left: 6em;
                }
            </style>
            <div class="code">
                ${this._code
                    .map(({ indent, code, label }, index) => {
                        return `<div id="${label}" class="code__line"><code class="code__number">${
                            index + 1
                        }</code><code class="code__text code__text--indent-${indent}">${code}</code></div>`;
                    })
                    .join("")}
            </div>
        `;
    }
}

customElements.define("pseudocode-display", PseudocodeDisplay);
