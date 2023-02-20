class PopUp extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._popUp = this.shadowRoot.querySelector("#popup");
        this._popUpContent = this.shadowRoot.querySelector("#popup-content");
        this._overlay = this.shadowRoot.querySelector("#overlay");

        this._overlay.addEventListener("click", this.close.bind(this));
        this.shadowRoot.querySelector("#close-btn").addEventListener("click", this.close.bind(this));
    }

    static get observedAttributes() {
        return ["template-id"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "template-id":
                const template = document.getElementById(newValue);
                if (!template) break;
                //remove old content and add new content
                this._popUpContent.textContent = "";
                this._popUpContent.appendChild(template.content.cloneNode(true));
                break;
        }
    }

    show() {
        this._popUp.classList.remove("popup--hidden");
        if (this.hasAttribute("overlay")) this._overlay.style.display = "block";
    }

    close() {
        this._popUp.classList.add("popup--hidden");
        this._overlay.style.display = "none";
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/static/css/index.css" />
            <style>
                :host {
                    display: inline-block;
                }
                .overlay {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: var(--popup-overlay-z-index, 100);
                }
                .popup {
                    display: block;
                    position: absolute;
                    top: var(--popup-top, 10%);
                    bottom: var(--popup-bottom);
                    left: var(--popup-left, 20%);
                    right: var(--popup-right);
                    height: var(--popup-height, 80%);
                    width: var(--popup-width, 60%);
                    min-width: var(--popup-min-width, 60%);
                    padding: var(--popup-padding, 20px);
                    background-color: var(--popup-background-color, white);
                    border-radius: var(--popup-border-radius, 10px);
                    box-shadow: 10px 3px 12px rgba(0, 0, 0, 0.3);
                    overflow: auto;
                    z-index: var(--popup-z-index, 101);
                }
                .popup.popup--hidden {
                    display: none;
                }
                .popup__button {
                    position: absolute;
                    top: 3px;
                    right: 5px;
                    border: none;
                    font-size: 1.5em;
                    background-color: rgba(0, 0, 0, 0);
                }
                .popup__content {
                    display: var(--popup-display, block);
                    grid-template-columns: var(--popup-grid-template-columns, auto auto);
                }
            </style>
            <div id="overlay" class="overlay"></div>
            <div id="popup" class="popup popup--hidden">
                <button id="close-btn" class="popup__button">x</button>
                <div id="popup-content" class="popup__content"><slot></slot></div>
            </div>
        `;
    }
}

customElements.define("pop-up", PopUp);
