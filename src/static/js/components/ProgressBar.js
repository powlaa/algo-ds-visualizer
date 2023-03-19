class ProgressBar extends HTMLElement {
    currentStep = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this.shadowRoot.querySelector("#next-btn").addEventListener("click", this.nextStep.bind(this));
        this.shadowRoot.querySelector("#prev-btn").addEventListener("click", this.prevStep.bind(this));

        this._slider = this.shadowRoot.querySelector("#range");
        this._slider.addEventListener("input", this._updateStepDisplay.bind(this));
        this._slider.addEventListener("change", () => {
            this.currentStep = parseInt(this._slider.value);
            this._updateStep();
        });
        this._slider.max = this.totalSteps;
        this._slider.style.setProperty("--max", this.totalSteps);
        this._slider.style.setProperty("--min", "0");
        this._slider.style.setProperty("--value", "0");
        if (!this.locked) this._updateStepDisplay();

        document.addEventListener("keydown", (e) => {
            if (e.keyCode === 39 && !this.locked) this.nextStep();
            else if (e.keyCode === 37 && !this.locked) this.prevStep();
        });
    }

    get totalSteps() {
        return this.hasAttribute("total-steps") ? parseInt(this.getAttribute("total-steps")) : 1;
    }

    get locked() {
        return this.hasAttribute("locked");
    }

    setCurrentStep(step, setup) {
        if (step < 0 || step > this.totalSteps) return;
        this.currentStep = step;
        this._updateStep(setup);
    }

    static get observedAttributes() {
        return ["total-steps", "locked"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "total-steps":
                this._slider.max = newValue;
                this._slider.style.setProperty("--max", this.totalSteps);
                this._updateStepDisplay();
                break;
            case "locked":
                this._slider.disabled = this.locked;
                this.shadowRoot.querySelector("#next-btn").disabled = this.locked;
                this.shadowRoot.querySelector("#prev-btn").disabled = this.locked;
                if (!this.locked) this._updateStepDisplay();
                break;
        }
    }

    reset() {
        this.removeAttribute("total-steps");
        this.setCurrentStep(0);
        this._updateStepDisplay(0);
    }

    nextStep() {
        this.setCurrentStep(this.currentStep + 1);
    }

    prevStep() {
        this.setCurrentStep(this.currentStep - 1);
    }

    _updateStepDisplay(totalSteps) {
        this.shadowRoot.querySelector("#step-display").innerHTML = this._slider.value + "/" + (totalSteps ?? this.totalSteps);
        this._slider.style.setProperty("--value", this._slider.value);
    }

    _updateStep(setup) {
        this._slider.value = this.currentStep;
        this._updateStepDisplay();
        if (!setup) this.dispatchEvent(new CustomEvent("update-step", { detail: { step: this.currentStep } }));
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/static/css/index.css" />
            <style>
                :host {
                    display: inline-block;
                }
                .container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 85px;
                }
                .control {
                    display: flex;
                    justify-content: center;
                }
                .control__button {
                    font-size: 2.5em;
                    width: 40px;
                    height: 60px;
                    border: none;
                    cursor: pointer;
                    background: none;
                }
                .control__display {
                    font-size: 3em;
                    line-height: 60px;
                    border: none;
                    cursor: pointer;
                    min-width: 50px;
                    text-align: center;
                }

                .slider {
                    width: 100%;
                    position: absolute;
                    bottom: 0.5em;
                    left: 0;
                    margin: 0;
                    z-index: var(--progress-bar-slider-z-index);
                }
            </style>
            <div class="container">
                <div class="control">
                    <button id="prev-btn" class="control__button" ${this.locked ? "disabled" : ""}><</button>
                    <span id="step-display" class="control__display" class="text">0/0</span>
                    <button id="next-btn" class="control__button" ${this.locked ? "disabled" : ""}>></button>
                </div>
                <input
                    type="range"
                    min="0"
                    max="${this.totalSteps}}"
                    value="0"
                    class="slider slider-progress"
                    id="range"
                    ${this.locked ? "disabled" : ""}
                />
            </div>
        `;
    }
}

customElements.define("progress-bar", ProgressBar);

// - lock visualisierung (Anzeige) beim slider und den controls
