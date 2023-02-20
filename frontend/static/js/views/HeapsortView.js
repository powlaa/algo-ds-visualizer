class HeapsortView extends HTMLElement {
    _ANIMATION_DURATION = 1000;
    _EXAMPLE_DATA = [5, 3, 7, 11, 9, 4, 2];
    _PSEUDOCODE = [
        {
            code: "<b>Heapsort</b>(A as array)",
            indent: 0,
            label: "heapsort",
        },
        {
            code: "<b>BuildMaxHeap</b>(A)",
            indent: 1,
            label: "heapsort-build-max-heap",
        },
        {
            code: "for i = A.length - 1 to 0",
            indent: 1,
            label: "heapsort-for-loop",
        },
        {
            code: "swap A[0] and A[i]",
            indent: 2,
            label: "heapsort-swap",
        },
        {
            code: "<b>Heapify</b>(A, 0)",
            indent: 2,
            label: "heapsort-heapify",
        },
        { code: "", indent: 0, label: "empty" },
        {
            code: "<b>BuildMaxHeap</b>(A as array)",
            indent: 0,
            label: "build-max-heap",
        },
        {
            code: "for i = floor(A.length / 2) to 0",
            indent: 1,
            label: "build-max-heap-for-loop",
        },
        {
            code: "<b>Heapify</b>(A, i)",
            indent: 2,
            label: "build-max-heap-heapify",
        },
        { code: "", indent: 0, label: "empty" },
        {
            code: "<b>Heapify</b>(A as array, i as int)",
            indent: 0,
            label: "heapify",
        },
        {
            code: "l = 2 * i + 1",
            indent: 1,
            label: "heapify-l",
        },
        {
            code: "r = 2 * i + 2",
            indent: 1,
            label: "heapify-r",
        },
        {
            code: "if l < A.length and A[l] > A[i]",
            indent: 1,
            label: "heapify-if-l",
        },
        {
            code: "max = l",
            indent: 2,
            label: "heapify-max-l",
        },
        {
            code: "else",
            indent: 1,
            label: "heapify-else-i",
        },
        {
            code: "max = i",
            indent: 2,
            label: "heapify-max-i",
        },
        {
            code: "if r < A.length and A[r] > A[max]",
            indent: 1,
            label: "heapify-if-r",
        },
        {
            code: "max = r",
            indent: 2,
            label: "heapify-max-r",
        },
        {
            code: "if max != i",
            indent: 1,
            label: "heapify-if-max",
        },
        {
            code: "swap A[i] and A[max]",
            indent: 2,
            label: "heapify-swap",
        },
        {
            code: "<b>Heapify</b>(A, max)",
            indent: 2,
            label: "heapify-heapify",
        },
    ];

    _stepCounter = 0;

    constructor() {
        super();
        document.title = "Heapsort";
        this.attachShadow({ mode: "open" });
        this._render();

        this._binaryTreeVis = this.shadowRoot.querySelector("binary-tree");
        this._arrayVis = this.shadowRoot.querySelector("array-display");
        this._header = this.shadowRoot.querySelector("header-element");
        this._pseudocodePopup = this.shadowRoot.querySelector("pop-up");
        this._pseudocodeDisplay = this.shadowRoot.querySelector("pseudocode-display");
        this._pseudocodeDisplay.code = this._PSEUDOCODE;

        this._header.addEventListener("start", (e) => {
            this._sort(e.detail.array);
        });

        const progressBar = this.shadowRoot.querySelector("progress-bar");
        progressBar.addEventListener("update-step", this._updateStep.bind(this));

        this._pseudocodePopup.show();
        this._sort();
    }

    static get observedAttributes() {
        return ["popup-template-id"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "popup-template-id":
                this._header.setAttribute("popup-template-id", newValue);
                break;
        }
    }

    _updateStep(e) {
        this._stepCounter++;
        const step = this._steps[e.detail.step];
        this._header.setAttribute("heading", step.heading);
        this._header.setAttribute("description", step.description);
        step.animation(step);
    }

    _updateVis(step, ...markers) {
        const dataWithModifiers = step.data.map((el, index) => {
            return { value: el, modifier: index < step.data.length - step.sortCount ? (markers.includes(index) ? "mark" : "") : "lock" };
        });
        this._binaryTreeVis.data = dataWithModifiers;
        this._arrayVis.data = dataWithModifiers;
        if (step.codeLabel) this._pseudocodeDisplay.highlightLine(...step.codeLabel);
        else this._pseudocodeDisplay.highlightLine();
    }

    async _swapNodes(step, index_A, index_B, stepIndex) {
        const stepCounter = this._stepCounter;
        this._updateVis(step, index_A, index_B);

        await Promise.all([
            this._binaryTreeVis.swap(index_A, index_B, this._ANIMATION_DURATION),
            this._arrayVis.swap(index_A, index_B, this._ANIMATION_DURATION),
        ]);

        if (stepCounter != this._stepCounter) return;
        if (this._steps[stepIndex + 1].sortCount > step.sortCount) {
            this._updateVis(step, index_A, index_B);
        }
    }

    async _compareNodes(step, index, maxChildIndex, sortCount) {
        const stepCounter = this._stepCounter;
        this._updateVis(step);

        const left = 2 * index + 1; //left child index
        const right = 2 * index + 2; //right child index

        await this._wait(this._ANIMATION_DURATION / 2);
        if (stepCounter != this._stepCounter) return;

        if (left < step.data.length - sortCount) {
            this._arrayVis.highlight(index);
            this._binaryTreeVis.highlight(index);
            this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-l", "heapify-r"]);

            await this._wait(this._ANIMATION_DURATION);
            if (stepCounter != this._stepCounter) return;

            this._binaryTreeVis.highlight(left);
            this._arrayVis.highlight(left);
            if (step.data[left] > step.data[index]) this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-l", "heapify-max-l"]);
            else this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-l", "heapify-else-i", "heapify-max-i"]);
        }
        if (right < step.data.length - sortCount) {
            await this._wait(this._ANIMATION_DURATION);
            if (stepCounter != this._stepCounter) return;

            this._binaryTreeVis.highlight(right);
            this._arrayVis.highlight(right);
            if (right === maxChildIndex) this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-r", "heapify-max-r"]);
            else this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-r"]);
        }
        await this._wait(this._ANIMATION_DURATION);
        if (stepCounter != this._stepCounter) return;
        //if the parent is smaller than the biggest child, turn them red to indicate a swap
        if (step.data[index] < step.data[maxChildIndex]) {
            this._binaryTreeVis.mark(index, maxChildIndex);
            this._arrayVis.mark(index, maxChildIndex);
            this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-max"]);
        } else this._pseudocodeDisplay.highlightLine(...step.codeLabel);
    }

    _sort(data) {
        this._stepCounter = 0;
        if (!data) data = this._EXAMPLE_DATA;

        this._steps = this._heapSort(data);
        console.log(this._steps);
        this.shadowRoot.querySelector("progress-bar").setAttribute("total-steps", this._steps.length - 1);
    }

    _heapSort(data) {
        let sortCount = 0;
        let length = data.length;

        //First step shows how array is put into binary tree
        let stepOrder = [
            {
                data: [...data],
                sortCount,
                heading: "Represent array in binary tree",
                description: `The first element of the array is the root, the second is the first child, the third is the second child, ...`,
                codeLabel: ["heapsort"],
                animation: (step) => this._updateVis(step),
            },
        ];

        for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
            //building the max heap
            if (i == Math.floor(length / 2) - 1)
                stepOrder = [
                    ...this._maxHeapify(
                        data,
                        i,
                        length,
                        sortCount,
                        "Build max heap starting from the last element in array with at least one child node",
                        ["heapsort-build-max-heap", "build-max-heap-heapify"],
                        stepOrder
                    ),
                ];
            else
                stepOrder = [
                    ...this._maxHeapify(
                        data,
                        i,
                        length,
                        sortCount,
                        "Build max heap",
                        ["heapsort-build-max-heap", "build-max-heap-heapify"],
                        stepOrder
                    ),
                ];
        }
        for (let i = length - 1; i >= 0; i--) {
            if (i != 0) {
                const stepIndex = stepOrder.length;
                stepOrder.push(
                    {
                        data: [...data],
                        sortCount,
                        heading: "Max Heap is complete",
                        description: `Every node is greater than its children and the root node is the largest element in the graph`,
                        animation: (step) => this._updateVis(step),
                    },
                    {
                        data: [...data],
                        sortCount,
                        heading: "Exchange root with last element",
                        description: `Swap ${data[0]} with ${data[i]} because ${data[0]} is the largest element in the graph and can be inserted at the next free spot at the end`,
                        codeLabel: ["heapsort-swap"],
                        animation: (step) => this._swapNodes(step, 0, i, stepIndex + 1),
                    }
                );
            }
            this._swap(data, 0, i); //delete the root element
            sortCount++;
            stepOrder = [
                ...this._maxHeapify(data, 0, i, sortCount, "Rebuild the max heap starting from the root node", ["heapsort-heapify"], stepOrder),
            ]; //build max heap again
        }
        stepOrder.push({
            data: [...data],
            sortCount,
            heading: "All sorted!",
            description: " ",
            animation: (step) => this._updateVis(step),
        });
        return stepOrder;
    }

    _maxHeapify(data, index, length, sortCount, heading, codeLabel, stepOrder) {
        let left = 2 * index + 1; //left child index
        let right = 2 * index + 2; //right child index
        let maximum = index;

        if (left < length && data[left] > data[maximum]) maximum = left;
        if (right < length && data[right] > data[maximum]) maximum = right;
        if (left < length || right < length) {
            const stepIndex = stepOrder.length;
            stepOrder.push({
                data: [...data],
                sortCount,
                heading,
                description: `Check children of ${data[index]} to see if they are greater than it`,
                codeLabel: [...codeLabel],
                animation: (step) => this._compareNodes(step, index, maximum, sortCount, stepIndex),
            });
        }
        //check if the largest child is greater than the parent
        if (data[index] < data[maximum]) {
            const stepIndex = stepOrder.length;
            stepOrder.push({
                data: [...data],
                sortCount,
                heading,
                description: `Swap ${data[index]} with the biggest child which is ${data[maximum]} to build the heap`,
                codeLabel: [...codeLabel, "heapify-swap"],
                animation: (step) => this._swapNodes(step, index, maximum, stepIndex),
            });
            this._swap(data, index, maximum);
            //it is? Swap both!
            stepOrder = [
                ...this._maxHeapify(
                    data,
                    maximum,
                    length,
                    sortCount,
                    `Check children of swapped node to build max heap`,
                    [...codeLabel, "heapify-heapify"],
                    stepOrder
                ),
            ]; //all over again!
        }
        return stepOrder;
    }

    _swap(data, index_A, index_B) {
        const tempValue = data[index_A];
        data[index_A] = data[index_B];
        data[index_B] = tempValue;
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .content {
                    display: flex;
                    width: 100%;
                }
                .content__array-display {
                    width: 50%;
                    height: 100%;
                }
                .content__binary-tree {
                    display: inline-block;
                    position: relative;
                    width: 50%;
                    vertical-align: top;
                    overflow: hidden;
                }
                .popup {
                    --popup-top: none;
                    --popup-bottom: 1.5em;
                    --popup-left: none;
                    --popup-right: 0px;
                    --popup-height: 200px;
                    --popup-width: 35%;
                    --popup-min-width: 350px;
                    --popup-border-radius: 10px 0 0 0;
                    --popup-grid-template-columns: auto auto;
                    --popup-z-index: 2;
                }
                .progress {
                    --progress-bar-slider-z-index: 2;
                }
            </style>
            <header-element title="Heapsort" start-btn-name="Sort" array-input></header-element>
            <div class="content">
                <array-display class="content__array-display"></array-display>
                <binary-tree class="content__binary-tree"></binary-tree>
            </div>
            <pop-up class="popup"><pseudocode-display></pseudocode-display></pop-up>
            <progress-bar class="progress"></progress-bar>
        `;
    }
}

Object.assign(HeapsortView.prototype, waitMixin);

customElements.define("heapsort-view", HeapsortView);
