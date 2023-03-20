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
            if (e.keyCode === 39 && !this.locked && !this._disconnected) this.nextStep();
            else if (e.keyCode === 37 && !this.locked && !this._disconnected) this.prevStep();
        });
    }

    disconnectedCallback() {
        this._disconnected = true;
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

                input[type="range"].slider:disabled.slider-progress::-webkit-slider-runnable-track {
                    background: linear-gradient(var(--disabled-progress-background-color, #b7b7b7), var(--disabled-progress-background-color, #b7b7b7)) 0 / var(--sx) 100%
                            no-repeat,
                        var(--disabled-track-background-color, #b7b7b7);
                }
                input[type="range"].slider:disabled.slider-progress:hover::-webkit-slider-runnable-track {
                    background: linear-gradient(var(--disabled-progress-background-color, #b7b7b7), var(--disabled-progress-background-color, #b7b7b7)) 0 / var(--sx) 100%
                            no-repeat,
                        var(--disabled-track-background-color, #b7b7b7);
                }

                input[type="range"].slider:disabled.slider-progress::-moz-range-track {
                    background: linear-gradient(var(--disabled-progress-background-color, #b7b7b7), var(--disabled-progress-background-color, #b7b7b7)) 0 / var(--sx) 100%
                            no-repeat,
                        var(--disabled-track-background-color, #b7b7b7);
                }
                input[type="range"].slider:disabled.slider-progress:hover::-moz-range-track {
                    background: linear-gradient(var(--disabled-progress-background-color, #b7b7b7), var(--disabled-progress-background-color, #b7b7b7)) 0 / var(--sx) 100%
                            no-repeat,
                        var(--disabled-track-background-color, #b7b7b7);
                }

                input[type="range"].slider:disabled::-webkit-slider-thumb {
                    background: var(--disabled-thumb-background-color, grey);
                }

                input[type="range"].slider:disabled::-webkit-slider-thumb:hover {
                    background: var(--disabled-thumb-background-color, grey);
                }

                input[type="range"].slider:disabled::-moz-range-thumb {
                    background: var(--disabled-thumb-background-color, grey);
                }

                input[type="range"].slider:disabled::-moz-range-thumb:hover {
                    background: var(--disabled-thumb-background-color, grey);
                }

                /*generated with Input range slider CSS style generator (version 20211225)
                https://toughengineer.github.io/demo/slider-styler*/
                input[type="range"].slider {
                    height: 1em;
                    -webkit-appearance: none;
                }

                /*progress support*/
                input[type="range"].slider.slider-progress {
                    --range: calc(var(--max) - var(--min));
                    --ratio: calc((var(--value) - var(--min)) / var(--range));
                    --sx: calc(0.5 * 1.5em + var(--ratio) * (100% - 1.5em));
                }

                input[type="range"].slider:focus {
                    outline: none;
                }

                /*webkit*/
                input[type="range"].slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 1.5em;
                    height: 2em;
                    border-radius: 0;
                    background: var(--primary-background-color-darker, #038b72);
                    border: none;
                    box-shadow: 0 0 1px black;
                    margin-top: calc(max((2em - 1px - 1px) * 0.5, 0px) - 2em * 0.5);
                }

                input[type="range"].slider::-webkit-slider-runnable-track {
                    height: 2em;
                    border: 1px solid #b2b2b2;
                    border-radius: 0;
                    background: #b0e2d9;
                    box-shadow: none;
                }

                input[type="range"].slider::-webkit-slider-thumb:hover {
                    background: var(--primary-background-color-darker-darker, #037b72);
                }

                input[type="range"].slider:hover::-webkit-slider-runnable-track {
                    background: #a8e0d7;
                }

                input[type="range"].slider.slider-progress::-webkit-slider-runnable-track {
                    background: linear-gradient(var(--primary-background-color, #03a688), var(--primary-background-color, #03a688)) 0 / var(--sx) 100%
                            no-repeat,
                        #b0e2d9;
                }

                input[type="range"].slider.slider-progress:hover::-webkit-slider-runnable-track {
                    background: linear-gradient(var(--primary-color-lighter, #03a088), var(--primary-color-lighter, #03a088)) 0 / var(--sx) 100%
                            no-repeat,
                        #a8e0d7;
                }

                /*mozilla*/
                input[type="range"].slider::-moz-range-thumb {
                    width: 1.5em;
                    height: 2em;
                    border-radius: 0;
                    background: var(--primary-background-color-darker, #038b72);
                    border: none;
                    box-shadow: 0 0 1px black;
                }

                input[type="range"].slider::-moz-range-track {
                    height: max(calc(2em - 1px - 1px), 0px);
                    border: 1px solid #b2b2b2;
                    border-radius: 0;
                    background: #b0e2d9;
                    box-shadow: none;
                }

                input[type="range"].slider::-moz-range-thumb:hover {
                    background: var(--primary-background-color-darker-darker, #037b72);
                }

                input[type="range"].slider:hover::-moz-range-track {
                    background: #a8e0d7;
                }

                input[type="range"].slider.slider-progress::-moz-range-track {
                    background: linear-gradient(var(--primary-background-color, #03a688), var(--primary-background-color, #03a688)) 0 / var(--sx) 100%
                            no-repeat,
                        #b0e2d9;
                }

                input[type="range"].slider.slider-progress:hover::-moz-range-track {
                    background: linear-gradient(var(--primary-color-lighter, #03a088), var(--primary-color-lighter, #03a088)) 0 / var(--sx) 100%
                            no-repeat,
                        #a8e0d7;
                }

                /*ms*/
                input[type="range"].slider::-ms-fill-upper {
                    background: transparent;
                    border-color: transparent;
                }

                input[type="range"].slider::-ms-fill-lower {
                    background: transparent;
                    border-color: transparent;
                }

                input[type="range"].slider::-ms-thumb {
                    width: 1.5em;
                    height: 2em;
                    border-radius: 0;
                    background: var(--primary-background-color-darker, #038b72);
                    border: none;
                    box-shadow: 0 0 1px black;
                    margin-top: 0;
                    box-sizing: border-box;
                }

                input[type="range"].slider::-ms-track {
                    height: 2em;
                    border-radius: 0;
                    background: #b0e2d9;
                    border: 1px solid #b2b2b2;
                    box-shadow: none;
                    box-sizing: border-box;
                }

                input[type="range"].slider::-ms-thumb:hover {
                    background: var(--primary-background-color-darker-darker, #037b72);
                }

                input[type="range"].slider:hover::-ms-track {
                    background: #a8e0d7;
                }

                input[type="range"].slider.slider-progress::-ms-fill-lower {
                    height: max(calc(2em - 1px - 1px), 0px);
                    border-radius: 0px 0 0 0px;
                    margin: -1px 0 -1px -1px;
                    background: var(--primary-background-color, #03a688);
                    border: 1px solid #b2b2b2;
                    border-right-width: 0;
                }

                input[type="range"].slider.slider-progress:hover::-ms-fill-lower {
                    background: var(--primary-color-lighter, #03a088);
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
