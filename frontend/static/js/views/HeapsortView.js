const ANIMATION_DURATION = 1000;
const EXAMPLE_DATA = [5, 3, 7, 11, 9, 4, 2];

class HeapsortView extends HTMLElement {
    _stepCounter = 0;

    constructor() {
        super();
        document.title = "Heapsort";
        this.attachShadow({ mode: "open" });
        this._render();

        this._binaryTreeVis = this.shadowRoot.querySelector("binary-tree");
        this._arrayVis = this.shadowRoot.querySelector("array-display");
        this._header = this.shadowRoot.querySelector("header-element");

        this._header.addEventListener("start", (e) => {
            this._sort(e.detail.array);
        });

        const progressBar = this.shadowRoot.querySelector("progress-bar");
        progressBar.addEventListener("update-step", (e) => {
            this._stepCounter++;
            const step = this._steps[e.detail.step];
            console.log(step);
            this._header.setAttribute("heading", step.heading);
            this._header.setAttribute("description", step.description);
            step.animation(step);
        });

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

    _updateVis(data, sortCount, ...markers) {
        const dataWithModifiers = data.map((el, index) => {
            return { value: el, modifier: index < data.length - sortCount ? (markers.includes(index) ? "mark" : "") : "lock" };
        });
        this._binaryTreeVis.data = dataWithModifiers;
        this._arrayVis.data = dataWithModifiers;
    }

    async _swapNodes(step, index_A, index_B, stepIndex) {
        const stepCounter = this._stepCounter;
        this._updateVis(step.data, step.sortCount, index_A, index_B);

        await Promise.all([
            this._binaryTreeVis.swap(index_A, index_B, ANIMATION_DURATION),
            this._arrayVis.swap(index_A, index_B, ANIMATION_DURATION),
        ]);

        if (stepCounter != this._stepCounter) return;
        if (this._steps[stepIndex + 1].sortCount > step.sortCount) {
            this._updateVis(this._steps[stepIndex + 1].data, this._steps[stepIndex + 1].sortCount, index_A, index_B);
        }
    }

    async _compareNodes(step, index, maxChildIndex, sortCount) {
        const stepCounter = this._stepCounter;
        this._updateVis(step.data, step.sortCount);

        const left = 2 * index + 1; //left child index
        const right = 2 * index + 2; //right child index

        await this._wait(ANIMATION_DURATION / 2);
        if (stepCounter != this._stepCounter) return;

        if (left < step.data.length - sortCount) {
            this._arrayVis.highlight(index);
            this._binaryTreeVis.highlight(index);

            await this._wait(ANIMATION_DURATION);
            if (stepCounter != this._stepCounter) return;

            this._binaryTreeVis.highlight(left);
            this._arrayVis.highlight(left);
        }
        if (right < step.data.length - sortCount) {
            await this._wait(ANIMATION_DURATION);
            if (stepCounter != this._stepCounter) return;

            this._binaryTreeVis.highlight(right);
            this._arrayVis.highlight(right);
        }
        //if the parent is smaller than the biggest child, turn them red to indicate a swap
        if (step.data[index] < step.data[maxChildIndex]) {
            await this._wait(ANIMATION_DURATION);
            if (stepCounter != this._stepCounter) return;

            this._binaryTreeVis.mark(index, maxChildIndex);
            this._arrayVis.mark(index, maxChildIndex);
        }
    }

    _sort(data) {
        this._stepCounter = 0;
        if (!data) data = EXAMPLE_DATA;

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
                animation: (step) => this._updateVis(step.data, step.sortCount),
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
                        stepOrder
                    ),
                ];
            else stepOrder = [...this._maxHeapify(data, i, length, sortCount, "Build max heap", stepOrder)];
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
                        animation: (step) => this._updateVis(step.data, step.sortCount),
                    },
                    {
                        data: [...data],
                        sortCount,
                        heading: "Exchange root with last element",
                        description: `Swap ${data[0]} with ${data[i]} because ${data[0]} is the largest element in the graph and can be inserted at the next free spot at the end`,
                        animation: (step) => this._swapNodes(step, 0, i, stepIndex + 1),
                    }
                );
            }
            this._swap(data, 0, i); //delete the root element
            sortCount++;
            stepOrder = [...this._maxHeapify(data, 0, i, sortCount, "Rebuild the max heap starting from the root node", stepOrder)]; //build max heap again
        }
        stepOrder.push({
            data: [...data],
            sortCount,
            heading: "All sorted!",
            description: " ",
            animation: (step) => this._updateVis(step.data, step.sortCount),
        });
        return stepOrder;
    }

    _maxHeapify(data, index, length, sortCount, heading, stepOrder) {
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
                animation: (step) => this._swapNodes(step, index, maximum, stepIndex),
            });
            this._swap(data, index, maximum);
            //it is? Swap both!
            stepOrder = [...this._maxHeapify(data, maximum, length, sortCount, "Check children of swapped node to build max heap", stepOrder)]; //all over again!
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
            </style>
            <header-element title="Heapsort" start-btn-name="Sort" array-input></header-element>
            <div class="content">
                <array-display class="content__array-display"></array-display>
                <binary-tree class="content__binary-tree"></binary-tree>
            </div>
            <progress-bar></progress-bar>
        `;
    }
}

Object.assign(HeapsortView.prototype, waitMixin);

customElements.define("heapsort-view", HeapsortView);
