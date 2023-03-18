class SplitLayout extends HTMLElement {
    _x = 0;
    _y = 0;
    _leftWidth = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this.shadowRoot.querySelectorAll(".resizer").forEach((resizer) => this.resizable(resizer));
    }

    // taken and adjusted from a Tutorial by Nguyen Huu Phuoc: https://htmldom.dev/create-resizable-split-views/ (last accessed 18.03.2023)
    resizable(resizer) {
        const direction = resizer.getAttribute("data-direction") || "horizontal";
        const prevSibling = resizer.previousElementSibling;
        const nextSibling = resizer.nextElementSibling;

        // The current position of mouse
        let x = 0;
        let y = 0;
        let prevSiblingHeight = 0;
        let prevSiblingWidth = 0;

        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const mouseDown = function (e) {
            // Get the current mouse position
            x = e.clientX;
            y = e.clientY;
            const rect = prevSibling.getBoundingClientRect();
            prevSiblingHeight = rect.height;
            prevSiblingWidth = rect.width;

            // Attach the listeners to `document`
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
        };

        const mouseMove = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - x;
            const dy = e.clientY - y;

            switch (direction) {
                case "vertical":
                    const h = ((prevSiblingHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
                    prevSibling.style.height = `${h}%`;
                    break;
                case "horizontal":
                default:
                    const w = ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
                    prevSibling.style.width = `${w}%`;
                    break;
            }

            const cursor = direction === "horizontal" ? "col-resize" : "row-resize";
            document.body.style.cursor = cursor;

            prevSibling.style.userSelect = "none";
            prevSibling.style.pointerEvents = "none";

            nextSibling.style.userSelect = "none";
            nextSibling.style.pointerEvents = "none";
        };

        const mouseUp = function () {
            document.body.style.removeProperty("cursor");

            prevSibling.style.removeProperty("user-select");
            prevSibling.style.removeProperty("pointer-events");

            nextSibling.style.removeProperty("user-select");
            nextSibling.style.removeProperty("pointer-events");

            // Remove the handlers of `mousemove` and `mouseup`
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        };

        // Attach the handler
        resizer.addEventListener("mousedown", mouseDown);
    }

    setTopLeftHeight(percentage) {
        this.shadowRoot.querySelector(".container__top-left").style.height = `${percentage}%`;
    }

    setTopRightHeight(percentage) {
        this.shadowRoot.querySelector(".container__top-right").style.height = `${percentage}%`;
    }

    toggleLeftResizerVertical() {
        const resizerLeft = this.shadowRoot.querySelector(".container__left > .resizer--vertical");
        resizerLeft.style.display = resizerLeft.style.display === "none" ? "block" : "none";
    }

    toggleRightResizerVertical() {
        const resizerRight = this.shadowRoot.querySelector(".container__right > .resizer--vertical");
        resizerRight.style.display = resizerRight.style.display === "none" ? "block" : "none";
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    display: flex;
                    width: 100%;
                    height: var(--split-layout-height, 100%);
                }
                .container__left {
                    width: var(--split-layout-initial-width-left, 50%);
                    min-width: 20%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: var(--split-layout-justify-content-left, center);
                }
                .container__right {
                    min-width: 20%;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: var(--split-layout-justify-content-right, center);
                }
                .container__top-left {
                    min-height: 20%;
                    height: 50%;
                    display: flex;
                    align-items: var(--split-layout-align-items-top-left, center);
                    justify-content: var(--split-layout-justify-content-top-left, center);
                    width: 100%;
                }
                .container__bottom-left {
                    flex: 1;
                    display: flex;
                    width: 100%;
                }
                .container__top-right {
                    min-height: 20%;
                    height: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                }

                .container__bottom-right {
                    flex: 1;
                    display: flex;
                    width: 100%;
                }
                .resizer--horizontal {
                    border-left: var(--split-layout-resizer-border, 2px solid #80808036);
                    cursor: col-resize;
                }
                .resizer--vertical {
                    border-bottom:  var(--split-layout-resizer-border, 2px solid #80808036);
                    cursor: row-resize;
                    width: 100%;
                }
            </style>
            <div class="container">
                ${
                    this.hasAttribute("top-bottom-left")
                        ? `<div class="container__left">
                    <div class="container__top-left"><slot name="top-left"></slot> </div>
                    <div class="resizer resizer--vertical" data-direction="vertical"></div>
                    <div class="container__bottom-left"><slot name="bottom-left"></slot></div>
                </div>`
                        : `<slot name="left" class="container__left"></slot>`
                }

                <div class="resizer resizer--horizontal" data-direction="horizontal"></div>
                ${
                    this.hasAttribute("top-bottom-right")
                        ? `<div class="container__right">
                    <slot name="top-right" class="container__top-right"></slot>
                    <div class="resizer resizer--vertical" data-direction="vertical"></div>
                    <slot name="bottom-right" class="container__bottom-right"></slot>
                </div>`
                        : `<slot name="right" class="container__right"></slot>`
                }
            </div>
        `;
    }
}

customElements.define("split-layout", SplitLayout);
