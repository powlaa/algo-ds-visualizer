class QuickSortView extends HTMLElement {
    _ANIMATION_DURATION = 1000;
    _EXAMPLE_DATA = [5, 3, 7, 11, 9, 4, 2];
    _PSEUDOCODE = [
        { code: "<b>Quicksort</b>(A as array)", indent: 0, label: "quicksort" },
        { code: "<b>Sort</b>(A, 0, A.length - 1)", indent: 1, label: "start-sort" },
        { code: "", indent: 0, label: "empty" },
        { code: "<b>Sort</b>(A as array, low as int, high as int)", indent: 1, label: "sort" },
        { code: "<b>if</b> low < high", indent: 2, label: "sort-if" },
        { code: "pivotIndex = <b>Partition</b>(A, low, high)", indent: 3, label: "pivot-index" },
        { code: "<b>Sort</b>(A, low, pivotIndex - 1)", indent: 3, label: "sort-low-to-pivot" },
        { code: "<b>Sort</b>(A, pivotIndex + 1, high)", indent: 3, label: "sort-pivot-to-high" },
        { code: "", indent: 0, label: "empty" },
        { code: "<b>Partition</b>(A as array, low as int, high as int) as int", indent: 1, label: "partition" },
        { code: "pivot = A[high]", indent: 2, label: "pivot" },
        { code: "i = low - 1", indent: 2, label: "i" },
        { code: "<b>for</b> j = low to high - 1", indent: 2, label: "for" },
        { code: "<b>if</b> A[j] <= pivot", indent: 3, label: "partition-if" },
        { code: "i = i + 1", indent: 4, label: "i-increment" },
        { code: "<b>if</b> i+1 != j", indent: 4, label: "partition-if-i-j" },
        { code: "<b>Swap</b>(A[i], A[j])", indent: 5, label: "swap-i-j" },
        { code: "<b>Swap</b>(A[i + 1], A[high])", indent: 2, label: "swap-i-high" },
        { code: "<b>return</b> i + 1", indent: 2, label: "return" },
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._splitLayout = this.shadowRoot.querySelector("split-layout");
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
            return { value: el, modifier: markers.includes(index) ? "mark" : ""};
        });
        this._arrayVis.data = dataWithModifiers;
        if (step.codeLabel) this._pseudocodeDisplay.highlightLine(...step.codeLabel);
        else this._pseudocodeDisplay.highlightLine();
    }

    async _swapNodes(step, index_A, index_B) {
        const stepCounter = this._visContainer.stepCounter;
        this._updateVis(step, index_A, index_B);

        await Promise.all([
            this._arrayVis.swap(index_A, index_B, this._ANIMATION_DURATION), 
        ]);
    }

    _sort(data) {
        if (!data) data = this._EXAMPLE_DATA;

        this._visContainer.updateSteps(this._quickSort(data), { currentStep: 0 });
    }

    _quickSort(data) {
        let sortCount = 0;
        let length = data.length;
        let recursionCalls = 0;

        //First step shows how array is put into binary tree
        let stepOrder = [
            {
                data: [...data],
                sortCount,
                heading: "Sorting the array with Quicksort",
                description: "",
                codeLabel: ["quicksort"],
                animation: (step) => this._updateVis(step),
            },
        ];

        // Recursive Quicksort function
        const quicksortRecursive = (arr, low, high) => {
            // decides which recursion Call is highlighted in Pseudocode
            let codeLabelRecursionCall = ""
            if (recursionCalls % 2 == 0)
                codeLabelRecursionCall = "sort-pivot-to-high"
            if (recursionCalls == 0)
                codeLabelRecursionCall = "start-sort"
            if (recursionCalls % 2 != 0)
                codeLabelRecursionCall = "sort-low-to-pivot"
            recursionCalls++;

            stepOrder.push(
                {
                    data: [...arr],
                    sortCount,
                    heading: `Calling Sort with low = ${low} and high = ${high}`,
                    description: ``,
                    codeLabel: [codeLabelRecursionCall, "sort", "sort-if"],
                    animation: (step) => this._updateVis(step),
                }
            );

            if (low < high) {
                stepOrder.push(
                    {
                        data: [...arr],
                        sortCount,
                        heading: `Partitioning the Array between position ${low} and ${high}`,
                        description: ``,
                        codeLabel: ["pivot-index"],
                        animation: (step) => this._lockUnfocusedElements(step, low, high, length),
                    }
                );
                const pivotIndex = partition(arr, low, high);

                quicksortRecursive(arr, low, pivotIndex - 1);
                quicksortRecursive(arr, pivotIndex + 1, high);
            }
        };

        const partition = (arr, low, high) => {
            const pivot = arr[high];

            stepOrder.push(
                {
                    data: [...arr],
                    sortCount,
                    heading: `Partition the array around the pivot ${pivot}`,
                    description: `low = ${low}; high = ${high}`,
                    codeLabel: ["partition", "pivot"],
                    animation: (step) => this._highlightPivot(step, low, high, length),
                }
            );

            let i = low - 1;

            stepOrder.push(
                {
                    data: [...arr],
                    sortCount,
                    heading: `Check if elements in partition are lower than pivot`,
                    description: `low = ${low}; high = ${high}; i = ${i}`,
                    codeLabel: ["i", "for"],
                    animation: (step) => this._highlightPivot(step, low, high, length),
                }
            );
    
            for (let j = low; j < high; j++) {
                stepOrder.push(
                    {
                        data: [...arr],
                        sortCount,
                        heading: `${arr[j]} < ${pivot}?`,
                        description: `low = ${low}; high = ${high}; i = ${i}; j = ${j}`,
                        codeLabel: ["for", "partition-if"],
                        animation: (step) => this._compare(step, low, high, length, j),
                    }
                );
                if (arr[j] < pivot) {
                    i++;
                    stepOrder.push(
                        {
                            data: [...arr],
                            sortCount,
                            heading: `${i} != ${j}?`,
                            description: `low = ${low}; high = ${high}; i = ${i}; j = ${j}`,
                            codeLabel: ["i-increment", "partition-if-i-j"],
                            animation: (step) => this._compare(step, low, high, length, j),
                        }
                    );
                    if (i != j){
                        stepOrder.push(
                            {
                                data: [...arr],
                                sortCount,
                                heading: `Swapping ${arr[i]} with ${arr[j]}`,
                                description: `low = ${low}; high = ${high}; i = ${i}`,
                                codeLabel: ["swap-i-j"],
                                animation: (step) => this._swapNodes(step, i, j),
                            }
                        );
                        sortCount++;
                        swap(arr, i, j);
                    }
                }
            }
    
            stepOrder.push(
                {
                    data: [...arr],
                    sortCount,
                    heading: `Swapping ${arr[i+1]} with ${arr[high]}`,
                    description: `low = ${low}; high = ${high}; i = ${i}`,
                    codeLabel: ["swap-i-high"],
                    animation: (step) => this._swapNodes(step, i+1, high),
                }
            );
            swap(arr, i + 1, high);
            stepOrder.push(
                {
                    data: [...arr],
                    sortCount,
                    heading: `Return i + 1 = ${i+1}`,
                    description: ``,
                    codeLabel: ["return"],
                    animation: (step) => this._updateVis(step),
                }
            );
            return i + 1 ;
        }

        const swap = (data, index_A, index_B) => {
            const tempValue = data[index_A];
            data[index_A] = data[index_B];
            data[index_B] = tempValue;
        }

        // Initial call to quicksort
        quicksortRecursive(data, 0, length - 1);

        // Final step to indicate completion
        stepOrder.push({
            data: [...data],
            sortCount,
            heading: "All sorted!",
            description: "The array is now fully sorted",
            animation: (step) => this._updateVis(step),
        });

        return stepOrder;
    }

    _lockUnfocusedElements(step, low, high, length) {
        this._updateVis(step)
        for (let i = 0; i < length; i++)
            if (i < low || i > high) this._arrayVis.lock(i);
    }

    _highlightPivot(step, low, high, length) {
        this._lockUnfocusedElements(step, low, high, length)
        this._arrayVis.highlight(high);
    }

    _compare(step, low, high, length, compare) {
        this._highlightPivot(step, low, high, length)
        this._arrayVis.highlight(compare);
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
            </style>
            <vis-container title="Quicksort" start-btn-name="Sort" array-input popup-template-id="${this.getAttribute("popup-template-id")}">
                <split-layout class="content" left-right>
                    <array-display slot="left" class="content__array-display"></array-display>
                    <pseudocode-display slot="right" class="content__pseudocode"></pseudocode-display>
                </split-layout>
            </vis-container>
        `;
    }
}

Object.assign(QuickSortView.prototype, waitMixin);

customElements.define("quicksort-view", QuickSortView);
