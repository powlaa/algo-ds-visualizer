class HeapsortView extends HTMLElement {
    _ANIMATION_DURATION = 1000;
    _EXAMPLE_DATA = [5, 3, 7, 11, 9, 4, 2];
    _PSEUDOCODE = [
        { code: "<b>Heapsort</b>(A as array)", indent: 0, label: "heapsort" },
        { code: "<b>BuildMaxHeap</b>(A)", indent: 1, label: "heapsort-build-max-heap" },
        { code: "<b>for</b> i = A.length - 1 to 0", indent: 1, label: "heapsort-for-loop" },
        { code: "swap A[0] and A[i]", indent: 2, label: "heapsort-swap" },
        { code: "<b>Heapify</b>(A, 0)", indent: 2, label: "heapsort-heapify" },
        { code: "", indent: 0, label: "empty" },
        { code: "<b>BuildMaxHeap</b>(A as array)", indent: 0, label: "build-max-heap" },
        { code: "<b>for</b> i = floor(A.length / 2) to 0", indent: 1, label: "build-max-heap-for-loop" },
        { code: "<b>Heapify</b>(A, i)", indent: 2, label: "build-max-heap-heapify" },
        { code: "", indent: 0, label: "empty" },
        { code: "<b>Heapify</b>(A as array, i as int)", indent: 0, label: "heapify" },
        { code: "l = 2 * i + 1", indent: 1, label: "heapify-l" },
        { code: "r = 2 * i + 2", indent: 1, label: "heapify-r" },
        { code: "<b>if</b> l < A.length and A[l] > A[i]", indent: 1, label: "heapify-if-l" },
        { code: "max = l", indent: 2, label: "heapify-max-l" },
        { code: "<b>else</b>", indent: 1, label: "heapify-else-i" },
        { code: "max = i", indent: 2, label: "heapify-max-i" },
        { code: "<b>if</b> r < A.length and A[r] > A[max]", indent: 1, label: "heapify-if-r" },
        { code: "max = r", indent: 2, label: "heapify-max-r" },
        { code: "<b>if</b> max != i", indent: 1, label: "heapify-if-max" },
        { code: "swap A[i] and A[max]", indent: 2, label: "heapify-swap" },
        { code: "<b>Heapify</b>(A, max)", indent: 2, label: "heapify-heapify" },
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._splitLayout = this.shadowRoot.querySelector("split-layout");
        this._binaryTreeVis = this.shadowRoot.querySelector("binary-tree");
        this._arrayVis = this.shadowRoot.querySelector("array-display");
        this._visContainer = this.shadowRoot.querySelector("vis-container");
        this._pseudocodeDisplay = this.shadowRoot.querySelector("pseudocode-display");
        this._pseudocodeDisplay.code = this._PSEUDOCODE;

        this._visContainer.addEventListener("start", (e) => {
            this._sort(e.detail.array);
        });

        this._visContainer.addEventListener("code", this._toggleCode.bind(this));

        this._visContainer.addEventListener("show-step", this._showStep.bind(this));

        this._sort();
    }

    _showStep(e) {
        e.detail.step.animation(e.detail.step);
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
        const stepCounter = this._visContainer.stepCounter;
        this._updateVis(step, index_A, index_B);

        await Promise.all([
            this._binaryTreeVis.swap(index_A, index_B, this._ANIMATION_DURATION),
            this._arrayVis.swap(index_A, index_B, this._ANIMATION_DURATION),
        ]);

        if (stepCounter != this._visContainer.stepCounter) return;
        if (this._visContainer.steps[stepIndex + 1].sortCount > step.sortCount) {
            this._updateVis(
                { ...this._visContainer.steps[stepIndex + 1], codeLabel: step.codeLabel, sortCount: step.sortCount + 1 },
                index_A,
                index_B
            );
        }
    }

    async _compareNodes(step, index, maxChildIndex, sortCount) {
        const stepCounter = this._visContainer.stepCounter;
        this._updateVis(step);

        const left = 2 * index + 1; //left child index
        const right = 2 * index + 2; //right child index

        await this._wait(this._ANIMATION_DURATION / 2);
        if (stepCounter != this._visContainer.stepCounter) return;

        if (left < step.data.length - sortCount) {
            this._arrayVis.highlight(index);
            this._binaryTreeVis.highlight(index);
            this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-l", "heapify-r"]);

            await this._wait(this._ANIMATION_DURATION);
            if (stepCounter != this._visContainer.stepCounter) return;

            this._binaryTreeVis.highlight(left);
            this._arrayVis.highlight(left);
            if (step.data[left] > step.data[index]) this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-l", "heapify-max-l"]);
            else this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-l", "heapify-else-i", "heapify-max-i"]);
        }
        if (right < step.data.length - sortCount) {
            await this._wait(this._ANIMATION_DURATION);
            if (stepCounter != this._visContainer.stepCounter) return;

            this._binaryTreeVis.highlight(right);
            this._arrayVis.highlight(right);
            if (right === maxChildIndex) this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-r", "heapify-max-r"]);
            else this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-r"]);
        }
        await this._wait(this._ANIMATION_DURATION);
        if (stepCounter != this._visContainer.stepCounter) return;
        //if the parent is smaller than the biggest child, turn them red to indicate a swap
        if (step.data[index] < step.data[maxChildIndex]) {
            this._binaryTreeVis.mark(index, maxChildIndex);
            this._arrayVis.mark(index, maxChildIndex);
            this._pseudocodeDisplay.highlightLine(...[...step.codeLabel, "heapify-if-max"]);
        } else this._pseudocodeDisplay.highlightLine(...step.codeLabel);
    }

    _sort(data) {
        if (!data) data = this._EXAMPLE_DATA;

        if (data.length > 31) this._binaryTreeVis.setAttribute("node-radius", 15);
        else if (data.length > 15) this._binaryTreeVis.setAttribute("node-radius", 20);
        else this._binaryTreeVis.setAttribute("node-radius", 30);

        this._visContainer.updateSteps(this._heapSort(data), { currentStep: 0 });
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
            description: "Only the root element is left in the heap, so it is sorted",
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

    _toggleCode() {
        this._pseudocodeDisplay.toggleCode();
        this._splitLayout.toggleLeftResizerVertical();
        this._splitLayout.setTopLeftHeight(50);
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .content {
                    width: 100%;
                    --split-layout-height: calc(100% - 190px);
                }
                .content__array-display {
                    width: 100%;
                    overflow: auto;
                }
                .content__pseudocode {
                    width: 100%;
                }
                .content__binary-tree {
                    display: inline-block;
                    position: relative;
                    vertical-align: top;
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                }
            </style>
            <vis-container title="Heapsort" start-btn-name="Sort" array-input popup-template-id="${this.getAttribute("popup-template-id")}">
                <split-layout class="content" top-bottom-left>
                    <array-display slot="top-left" class="content__array-display"></array-display>
                    <pseudocode-display slot="bottom-left" class="content__pseudocode"></pseudocode-display>
                    <binary-tree slot="right" class="content__binary-tree" node-radius="30"></binary-tree>
                </split-layout>
            </vis-container>
        `;
    }
}

Object.assign(HeapsortView.prototype, waitMixin);

customElements.define("heapsort-view", HeapsortView);
