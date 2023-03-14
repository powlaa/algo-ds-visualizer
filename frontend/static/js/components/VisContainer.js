class VisContainer extends HTMLElement {
    _stepCounter = 0;
    _steps = [];
    _currentStepIndex = 0;

    _showStep = (step) => new CustomEvent("show-step", { detail: { step } });

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._header = this.shadowRoot.querySelector("header-element");

        this._progressBar = this.shadowRoot.querySelector("progress-bar");
        this._progressBar.addEventListener("update-step", this._updateStep.bind(this));
    }

    get locked() {
        return this.hasAttribute("locked");
    }

    get arrayInput() {
        return this.hasAttribute("array-input");
    }

    get stepCounter() {
        return this._stepCounter;
    }

    get currentStepIndex() {
        return this._currentStepIndex;
    }

    set stepCounter(stepCounter) {
        this._stepCounter = stepCounter;
    }

    get steps() {
        return this._steps;
    }

    updateSteps(steps, { currentStep, locked }) {
        this._steps = steps;
        this._stepCounter = 0;
        this._progressBar.setAttribute("total-steps", this._steps.length - 1);
        if (currentStep !== undefined) this._progressBar.setCurrentStep(currentStep);
        if (locked !== undefined) locked ? this._progressBar.setAttribute("locked", true) : this._progressBar.removeAttribute("locked");
    }

    resetProgressBar() {
        this._progressBar.reset();
    }

    static get observedAttributes() {
        return ["popup-template-id", "title", "start-btn-name", "array-input"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "popup-template-id":
                this._header.setAttribute("popup-template-id", newValue);
                break;
            case "title":
                this._header.setAttribute("title", newValue);
                document.title = newValue;
                break;
            case "start-btn-name":
                if (newValue) this._header.setAttribute("start-btn-name", newValue);
                else this._header.removeAttribute("start-btn-name");
                break;
            case "array-input":
                this.arrayInput ? this._header.setAttribute("array-input", true) : this._header.removeAttribute("array-input");
                break;
            case "locked":
                this.locked ? this._progressBar.setAttribute("locked", true) : this._progressBar.removeAttribute("locked");
                break;
        }
    }

    _updateStep(e) {
        this._currentStepIndex = e.detail.step;
        this._stepCounter++;
        const step = this._steps[e.detail.step];
        this._header.setAttribute("heading", step.heading);
        this._header.setAttribute("description", step.description);
        this.dispatchEvent(this._showStep(step));
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                slot {
                    width: 100%;
                }
                .progress {
                    --progress-bar-slider-z-index: 2;
                }
            </style>
            <header-element
                popup-template-id="${this.getAttribute("popup-template-id")}"
                title="${this.getAttribute("title")}"
                ${this.hasAttribute("start-btn-name") ? "start-btn-name=" + this.getAttribute("start-btn-name") : ""}
                ${this.hasAttribute("array-input") ? "array-input" : ""}
            ></header-element>
            <slot></slot>
            <progress-bar class="progress" ${this.hasAttribute("locked") ? "locked" : ""}></progress-bar>
        `;
    }
}

Object.assign(VisContainer.prototype, waitMixin);

customElements.define("vis-container", VisContainer);
