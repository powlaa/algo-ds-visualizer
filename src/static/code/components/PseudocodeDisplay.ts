import { Pseudocode } from "../types";

export class PseudocodeDisplay extends HTMLElement {
  private _shadow: ShadowRoot;
  private _code: Pseudocode[] = [];
  private _currentStyle = "block";

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "open" });
    this._render();
  }

  set code(code) {
    this._code = code;
    this._render();
  }

  get code() {
    return this._code;
  }

  /**
   * Highlights the lines of code with the given labels.
   * @param labels - The labels of the lines to highlight.
   */
  highlightLine(...labels: string[]) {
    this._shadow
      .querySelectorAll(`.code__line--highlighted`)
      .forEach((e) => e.classList.remove("code__line--highlighted"));
    labels.forEach((label) =>
      this._shadow
        .querySelector(`#${label}`)
        ?.classList.add("code__line--highlighted")
    );
  }

  /**
   * Toggles the visibility of the code.
   * @returns True if the code is visible, false otherwise.
   */
  toggleCode() {
    this._currentStyle = this._currentStyle === "none" ? "block" : "none";
    const codeContainer = this._shadow.querySelector(
      "#code-container"
    ) as HTMLElement;
    codeContainer.style.display = this._currentStyle;
    return this._currentStyle === "block";
  }

  _render() {
    this._shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
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
                    background-color: var(--pseudocode-highlight-background-color, #b0e2d9) !important;
                }
                .code__line--highlighted:nth-child(even) {
                    background-color: var(--pseudocode-highlight-background-color-alternate, #b0e2d9aa) !important;
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
            <div id="code-container" class="code" style="display:${
              this._currentStyle
            }">
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
