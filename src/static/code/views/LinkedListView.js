import {
    waitMixin
} from '../mixins/wait-mixin';

class LinkedListView extends HTMLElement {
    _ANIMATION_DURATION = 1000;
    _EXAMPLE_DATA = [5, 3, 7, 11];
    _PSEUDOCODE_CLASSES = {
        singly: [{
                code: "<b>class</b> Node",
                indent: 0,
                label: "node-class"
            },
            {
                code: "data: String",
                indent: 1,
                label: "node-data"
            },
            {
                code: "next: Node",
                indent: 1,
                label: "node-next"
            },
            {
                code: "<b>constructor</b>(given_data)",
                indent: 1,
                label: "node-init"
            },
            {
                code: "data = given_data",
                indent: 2,
                label: "node-set-data"
            },
            {
                code: "next = null",
                indent: 2,
                label: "node-set-next"
            },
            {
                code: "",
                indent: 0,
                label: "empty"
            },
            {
                code: "<b>class</b> SinglyLinkedList",
                indent: 0,
                label: "singlylinkedlist-class"
            },
            {
                code: "head: Node",
                indent: 1,
                label: "singlylinkedlist-head"
            },
            {
                code: "<b>constructor</b>()",
                indent: 1,
                label: "singlylinkedlist-init"
            },
            {
                code: "head = null",
                indent: 2,
                label: "singlylinkedlist-set-head"
            },
            {
                code: "",
                indent: 0,
                label: "empty"
            },
            {
                code: "list = new SinglyLinkedList()",
                indent: 0,
                label: "singlylinkedlist-instantiation"
            },
        ],
    };

    _PSEUDOCODE_METHODS = {
        singly: {
            delete: [{
                    code: "<b>function</b> <b>delete</b>(data)",
                    indent: 1,
                    label: "delete"
                },
                {
                    code: "<b>if</b> head.data == data",
                    indent: 2,
                    label: "delete-if-head-data"
                },
                {
                    code: "head = head.next",
                    indent: 3,
                    label: "delete-set-head"
                },
                {
                    code: "return",
                    indent: 3,
                    label: "delete-return"
                },
                {
                    code: "current = head",
                    indent: 2,
                    label: "delete-current-head"
                },
                {
                    code: "<b>while</b> current.next != null",
                    indent: 2,
                    label: "delete-while"
                },
                {
                    code: "<b>if</b> current.next.data == data",
                    indent: 3,
                    label: "delete-current-data"
                },
                {
                    code: "current.next = current.next.next",
                    indent: 4,
                    label: "delete-set-current"
                },
                {
                    code: "current = current.next",
                    indent: 3,
                    label: "delete-current-next"
                },
            ],
            contains: [{
                    code: "<b>function</b> <b>contains</b>(data)",
                    indent: 1,
                    label: "contains"
                },
                {
                    code: "<b>if</b> head.data == data",
                    indent: 2,
                    label: "contains-if-head-data"
                },
                {
                    code: "return true",
                    indent: 3,
                    label: "contains-return"
                },
                {
                    code: "current = head",
                    indent: 2,
                    label: "contains-current-head"
                },
                {
                    code: "<b>while</b> current.next != null",
                    indent: 2,
                    label: "contains-while"
                },
                {
                    code: "<b>if</b> current.next.data == data",
                    indent: 3,
                    label: "contains-current-data"
                },
                {
                    code: "return true",
                    indent: 4,
                    label: "contains-found"
                },
                {
                    code: "current = current.next",
                    indent: 3,
                    label: "contains-current-next"
                },
                {
                    code: "return false",
                    indent: 2,
                    label: "contains-not-found"
                },
            ],
            get: [{
                    code: "<b>function</b> <b>get</b>(index)",
                    indent: 1,
                    label: "get"
                },
                {
                    code: "<b>if</b> index == 0",
                    indent: 2,
                    label: "get-if-head-index"
                },
                {
                    code: "return head",
                    indent: 3,
                    label: "get-return"
                },
                {
                    code: "currentIndex = 0",
                    indent: 2,
                    label: "get-set-current-index"
                },
                {
                    code: "current = head",
                    indent: 2,
                    label: "get-current-head"
                },
                {
                    code: "<b>while</b> current.next != null",
                    indent: 2,
                    label: "get-while"
                },
                {
                    code: "<b>if</b> currentIndex + 1 == index",
                    indent: 3,
                    label: "get-if-index"
                },
                {
                    code: "return current.next",
                    indent: 4,
                    label: "get-found"
                },
                {
                    code: "currentIndex ++",
                    indent: 3,
                    label: "get-increment-current-index"
                },
                {
                    code: "current = current.next",
                    indent: 3,
                    label: "get-current-next"
                },
                {
                    code: "return null",
                    indent: 2,
                    label: "get-not-found"
                },
            ],
            add: [{
                    code: "<b>function</b> <b>add</b>(data, index)",
                    indent: 1,
                    label: "add"
                },
                {
                    code: "newNode = new Node(data)",
                    indent: 2,
                    label: "add-new-node"
                },
                {
                    code: "<b>if</b> head == null",
                    indent: 2,
                    label: "add-if-head"
                },
                {
                    code: "head = newNode",
                    indent: 3,
                    label: "add-first"
                },
                {
                    code: "return",
                    indent: 3,
                    label: "add-first-return"
                },
                {
                    code: "<b>if</b> index === 0",
                    indent: 2,
                    label: "add-if-zero"
                },
                {
                    code: "newNode.next = head.next",
                    indent: 3,
                    label: "add-next-head"
                },
                {
                    code: "head = newNode",
                    indent: 3,
                    label: "add-head-new"
                },
                {
                    code: "return",
                    indent: 3,
                    label: "add-head-return"
                },
                {
                    code: "currentIndex = 0",
                    indent: 2,
                    label: "add-set-current-index"
                },
                {
                    code: "current = head",
                    indent: 2,
                    label: "add-current-head"
                },
                {
                    code: "<b>while</b> current.next != null && currentIndex + 1 != index",
                    indent: 2,
                    label: "add-while"
                },
                {
                    code: "currentIndex ++",
                    indent: 3,
                    label: "add-increment-current-index"
                },
                {
                    code: "current = current.next",
                    indent: 3,
                    label: "add-current-next"
                },
                {
                    code: "newNode.next = current.next",
                    indent: 2,
                    label: "add-next-current"
                },
                {
                    code: "current.next = newNode",
                    indent: 2,
                    label: "add-current-new"
                },
            ],
        },
        empty: [{
            code: "",
            indent: 0,
            label: "empty"
        }],
    };

    _CONTROL_PANEL_METHODS = [{
            name: "add",
            parameters: [{
                    name: "index",
                    type: "number",
                    min: 0
                },
                {
                    name: "data",
                    type: "text"
                },
            ],
        },
        {
            name: "delete",
            parameters: [{
                name: "data",
                type: "text"
            }],
        },
        {
            name: "contains",
            parameters: [{
                name: "data",
                type: "text"
            }],
        },
        {
            name: "get",
            parameters: [{
                name: "index",
                type: "number",
                min: 0
            }],
        },
    ];

    constructor() {
        super();
        this.attachShadow({
            mode: "open"
        });
        this._render();

        this._visContainer = this.shadowRoot.querySelector("vis-container");
        this._splitLayout = this.shadowRoot.querySelector("split-layout");
        this._linkedListVis = this.shadowRoot.querySelector("linked-list");
        this._pseudocodeClasses = this.shadowRoot.querySelector("#pseudocode-classes");
        this._pseudocodeClasses.code = this._PSEUDOCODE_CLASSES.singly;
        this._pseudocodeMethods = this.shadowRoot.querySelector("#pseudocode-methods");
        this._controlPanel = this.shadowRoot.querySelector("control-panel");
        this._controlPanel.data = this._CONTROL_PANEL_METHODS;

        this._visContainer.addEventListener("show-step", this._showStep.bind(this));

        this._visContainer.addEventListener("code", this._toggleCode.bind(this));

        this._controlPanel.addEventListener("call-method", ({
            detail
        }) => {
            switch (detail.method) {
                case "add":
                    this._addNode(detail.params);
                    break;
                case "delete":
                    this._deleteNode(detail.params);
                    break;
                case "contains":
                    this._containsNode(detail.params);
                    break;
                case "get":
                    this._getIndex(detail.params);
                    break;
            }
        });

        this._initVis();
    }

    async _showStep(e) {
        const step = e.detail.step;
        this._linkedListVis.data = step.array;
        this._pseudocodeMethods.code = this._PSEUDOCODE_METHODS.singly[step.method] ?? [];
        this._linkedListVis.reset();
        await this._linkedListVis.updateLinkedList();
        if (step.codeLabel) this._pseudocodeMethods.highlightLine(...step.codeLabel);
        else this._pseudocodeMethods.highlightLine();
        await step.animation(this._linkedListVis, this._ANIMATION_DURATION, step, this._visContainer);
    }

    _addSteps(steps) {
        if (!steps) return;
        this._visContainer.updateSteps([...this._visContainer.steps, ...steps], {
            nextStep: true,
            locked: false,
            currentStep: this._visContainer.steps.length - 1,
        });
    }

    _initVis() {
        this._linkedList = new SinglyLinkedList();
        this._linkedList.add("23", 0);
        this._linkedList.add("22", 0);
        this._linkedList.add("15", 0);
        this._visContainer.updateSteps(
            [{
                heading: "",
                description: "",
                array: this._linkedList.toArray(),
                animation: () => {},
            }, ], {
                currentStep: 0
            }
        );
        this._linkedListVis.data = this._linkedList.toArray();
        this._linkedListVis.updateLinkedList();
    }

    _addNode(params) {
        let index = parseInt(params.index);
        if (!params.index) index = 0;
        const newSteps = this._linkedList.add(params.data, index);
        newSteps.forEach((n) => (n.method = "add"));
        this._addSteps(newSteps);
    }

    _deleteNode(params) {
        const newSteps = this._linkedList.delete(params.data);
        newSteps.forEach((n) => (n.method = "delete"));
        this._addSteps(newSteps);
    }

    _containsNode(params) {
        const newSteps = this._linkedList.contains(params.data);
        newSteps.forEach((n) => (n.method = "contains"));
        this._addSteps(newSteps);
    }

    _getIndex(params) {
        const newSteps = this._linkedList.get(parseInt(params.index));
        newSteps.forEach((n) => (n.method = "get"));
        this._addSteps(newSteps);
    }

    _toggleCode() {
        this._pseudocodeClasses.toggleCode();
        const visible = this._pseudocodeMethods.toggleCode();
        this._splitLayout.toggleRightResizerVertical();
        if (visible) {
            this._splitLayout.setTopLeftHeight(50);
            this._splitLayout.setTopRightHeight(50);
            return;
        }
        this._splitLayout.setTopLeftHeight(50);
        this._splitLayout.setTopRightHeight(95);
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                .content {
                    width: 100%;
                    --split-layout-height: calc(100% - 190px);
                    --split-layout-initial-width-left: 25%;
                    --split-layout-align-items-top-left: none;
                }
                .content__control-panel {
                    width: 100%;
                }
                .content__pseudocode {
                    width: 100%;
                }
                .content__linked-list {
                    display: inline-block;
                    position: relative;
                    vertical-align: top;
                    overflow: hidden;
                    height: 100%;
                    width: 100%;
                }
            </style>
            <vis-container title="Singly Linked List" no-start-btn locked popup-template-id="${this.getAttribute("popup-template-id")}">
                <split-layout class="content" top-bottom-left top-bottom-right>
                    <control-panel slot="top-left" class="content__control-panel"></control-panel>
                    <pseudocode-display id="pseudocode-classes" slot="bottom-left" class="content__pseudocode"></pseudocode-display>
                    <linked-list slot="top-right" class="content__linked-list"></linked-list>
                    <pseudocode-display id="pseudocode-methods" slot="bottom-right" class="content__pseudocode"></pseudocode-display>
                </split-layout>
            </vis-container>
        `;
    }
}

Object.assign(LinkedListView.prototype, waitMixin);

customElements.define("linked-list-view", LinkedListView);

class SinglyNode {
    constructor(data, id) {
        this.data = data;
        this.next = null;
        this.id = id;
    }
}

class SinglyLinkedList {
    idct = 0;
    constructor() {
        this.head = null;
    }
    add(data, index) {
        var steps = [];
        const newNode = new SinglyNode(data, this.idct++);
        if (this.head == null) index = 0;

        var {
            node,
            steps,
            index: nodeIndex
        } = this.getNodeBeforeIndex(index, `Add new Node at Index ${index}`, "add");

        if (index === 0) {
            //show new node, set next to head
            let codeLabel = ["add-if-head"];
            if (this.head) codeLabel = ["add-if-zero", "add-next-head"];
            steps.push({
                array: this.toArray(),
                heading: `Add new Node at Index ${index}`,
                description: "Set next of new Node to head",
                codeLabel: [...codeLabel],
                _index: index,
                animation: (linkedListVis, duration, step) => {
                    linkedListVis.addElement(data, newNode.id, step._index, duration);
                },
            });
            codeLabel = ["add-first", "add-first-return"];
            if (this.head) {
                newNode.next = this.head;
                codeLabel = ["add-head-new", "add-head-return"];
            }
            //set head to new node
            steps.push({
                array: this.toArray(),
                heading: `Add new Node at Index ${index}`,
                description: "Set head to new Node",
                _index: index,
                codeLabel: [...codeLabel],
                animation: async (linkedListVis, duration, step) => {
                    await linkedListVis.addElement(data, newNode.id, step._index);
                    linkedListVis.updateLinkedList(duration);
                },
            });
            this.head = newNode;
        } else {
            //show new node, set next to node.next
            let heading = `Add new Node at Index ${index}`;
            if (nodeIndex !== index) heading = `Add new Node as last node because Index ${index} is too large`;
            steps.push({
                array: this.toArray(),
                heading: heading,
                description: "Set next of new Node to current.next",
                _index: nodeIndex + 1,
                codeLabel: ["add-next-current"],
                animation: (linkedListVis, duration, step) => {
                    linkedListVis.setCurrentPointer(step._index - 1, 0, true);
                    linkedListVis.highlightLinks({
                        source: step._index - 1,
                        target: step._index
                    });
                    linkedListVis.addElement(data, newNode.id, step._index, duration);
                },
            });
            //set head to new node
            steps.push({
                array: this.toArray(),
                heading: heading,
                description: "Set current.next to new Node",
                _index: nodeIndex + 1,
                codeLabel: ["add-current-new"],
                animation: async (linkedListVis, duration, step) => {
                    linkedListVis.setCurrentPointer(step._index - 1, 0, true);
                    linkedListVis.highlightLinks({
                        source: step._index - 1,
                        target: step._index
                    });
                    await linkedListVis.addElement(data, newNode.id, step._index);
                    await linkedListVis.updateLinkedList(duration / 2);
                    linkedListVis.data = linkedListVis.data;
                    await linkedListVis.updateLinkedList(duration / 2);
                },
            });
            newNode.next = node.next;
            node.next = newNode;
        }
        return steps;
    }

    delete(data) {
        if (this.head === null) return [];
        var {
            node,
            steps,
            index
        } = this.getNodeBefore(data, `Delete Node "${data}"`, "delete");

        if ((node === this.head) & (index === null)) {
            //data is in the head
            steps.push({
                array: this.toArray(),
                heading: `Delete Node "${data}"`,
                description: `"${data}" is in head, move head to head.next`,
                codeLabel: ["delete-if-head-data", "delete-set-head"],
                animation: async (linkedListVis, duration) => {
                    linkedListVis.highlightElements(0);
                    await linkedListVis.moveLink({
                        source: "head",
                        target: 0,
                        newTarget: 1
                    }, duration);
                },
            });

            steps.push({
                array: this.toArray(),
                heading: `Node "${data}" is deleted`,
                description: `"${data}" is removed because no Node is pointing to it anymore`,
                codeLabel: ["delete-return"],
                animation: async (linkedListVis, duration) => {
                    await linkedListVis.moveLink({
                        source: "head",
                        target: 0,
                        newTarget: 1
                    });
                    linkedListVis.reset();
                    linkedListVis.data = linkedListVis.data.filter((el, index) => index !== 0);
                    await linkedListVis.updateLinkedList(duration);
                },
            });
            this.head = this.head.next;
            return steps;
        } else if (node && index !== null) {
            //data is found
            steps.push({
                array: this.toArray(),
                heading: `Delete Node "${data}"`,
                description: `Set next pointer of current Node to the next of "${data}"`,
                _index: index,
                codeLabel: ["delete-set-current"],
                animation: async (linkedListVis, duration, step) => {
                    await linkedListVis.setCurrentPointer(step._index);
                    linkedListVis.highlightLinks({
                        source: step._index,
                        target: step._index + 1
                    });
                    linkedListVis.highlightElements(step._index + 1);
                    await linkedListVis.moveLink({
                        source: step._index,
                        target: step._index + 1,
                        newTarget: step._index + 2
                    }, duration);
                },
            });

            steps.push({
                array: this.toArray(),
                heading: `Node "${data}" is deleted`,
                description: `"${data}" is removed because no Node is pointing to it anymore`,
                _index: index,
                codeLabel: [],
                animation: async (linkedListVis, duration, step) => {
                    await linkedListVis.moveLink({
                        source: step._index,
                        target: step._index + 1,
                        newTarget: step._index + 2
                    }, 1);
                    linkedListVis.reset();
                    linkedListVis.data = linkedListVis.data.filter((el, index) => index !== step._index + 1);
                    await linkedListVis.updateLinkedList(duration);
                },
            });
            node.next = node.next.next;
            return steps;
        }

        return steps;
    }

    contains(data) {
        if (this.head === null) return [];
        var {
            node,
            steps,
            index
        } = this.getNodeBefore(data, `Contains "${data}"`, "contains");

        if ((node === this.head) & (index === null)) {
            steps.push({
                array: this.toArray(),
                heading: `Contains "${data}"`,
                description: `"${data}" is in head`,
                codeLabel: ["contains-if-head-data", "contains-return"],
                animation: async (linkedListVis) => {
                    linkedListVis.highlightElements(0);
                    linkedListVis.highlightLinks({
                        source: "head",
                        target: 0
                    });
                },
            });
        }
        return steps;
    }

    get(index) {
        if (this.head === null || index < 0) return [];
        var {
            node,
            steps
        } = this.getNodeBeforeIndex(index, `Get Node with index ${index}`, "get");

        if ((node === this.head) & (index === 0)) {
            steps.push({
                array: this.toArray(),
                heading: "Get Node with index " + index,
                description: `Index ${index} is the head Node`,
                codeLabel: ["get-if-head-index", "get-return"],
                animation: async (linkedListVis) => {
                    linkedListVis.highlightElements(0);
                    linkedListVis.highlightLinks({
                        source: "head",
                        target: 0
                    });
                },
            });
        }
        return steps;
    }

    getNodeBefore(data, heading, codeLabelPrefix) {
        var steps = [];
        if (this.head == null) return {
            node: null,
            index: null,
            steps
        };

        if (this.head.data == data) return {
            node: this.head,
            index: null,
            steps
        };

        let current = this.head;
        let index = 0;
        //current pointer head
        steps.push({
            array: this.toArray(),
            heading: heading,
            description: `"${data}" is not in head, so go through list until "${data}" is found in the next Node`,
            _index: index,
            codeLabel: [`${codeLabelPrefix}-current-head`],
            animation: async (linkedListVis, duration, step) => {
                linkedListVis.highlightLinks({
                    source: "head",
                    target: step._index
                });
                linkedListVis.setCurrentPointer(step._index, duration);
            },
        });

        while (current.next != null) {
            if (current.next.data == data) {
                steps.push({
                    array: this.toArray(),
                    heading: heading,
                    description: `"${data}" is found in the next Node of the current one`,
                    _index: index,
                    codeLabel: [`${codeLabelPrefix}-while`, `${codeLabelPrefix}-current-data`, `${codeLabelPrefix}-found`],
                    animation: async (linkedListVis, duration, step, visContainer) => {
                        const stepCounter = visContainer.stepCounter;
                        if (step._index === 0) await linkedListVis.setCurrentPointer(step._index);
                        else {
                            await linkedListVis.setCurrentPointer(step._index - 1);
                            await linkedListVis.setCurrentPointer(step._index, duration);
                        }
                        if (stepCounter != visContainer.stepCounter) return;
                        linkedListVis.highlightLinks({
                            source: step._index,
                            target: step._index + 1
                        });
                        linkedListVis.highlightElements(step._index + 1);
                    },
                });
                return {
                    node: current,
                    index,
                    steps
                };
            }
            steps.push({
                array: this.toArray(),
                heading: heading,
                description: `Go through list until current.next.data equals "${data}"`,
                _index: index,
                codeLabel: [`${codeLabelPrefix}-while`, `${codeLabelPrefix}-current-next`],
                animation: async (linkedListVis, duration, step, visContainer) => {
                    const stepCounter = visContainer.stepCounter;
                    if (step._index === 0) await linkedListVis.setCurrentPointer(step._index);
                    else {
                        await linkedListVis.setCurrentPointer(step._index - 1);
                        await linkedListVis.setCurrentPointer(step._index, duration);
                    }
                    if (stepCounter != visContainer.stepCounter) return;
                    linkedListVis.highlightLinks({
                        source: step._index,
                        target: step._index + 1
                    });
                },
            });
            index++;
            //current pointer weiterschieben
            current = current.next;
        }
        steps.push({
            array: this.toArray(),
            heading: heading,
            description: `current.next is null, therefore "${data}" is not in the list`,
            _index: index,
            codeLabel: [`${codeLabelPrefix}-while`, `${codeLabelPrefix}-not-found`],
            animation: async (linkedListVis, duration, step, visContainer) => {
                const stepCounter = visContainer.stepCounter;
                if (step._index === 0) await linkedListVis.setCurrentPointer(step._index);
                else {
                    await linkedListVis.setCurrentPointer(step._index - 1);
                    await linkedListVis.setCurrentPointer(step._index, duration);
                }
                if (stepCounter != visContainer.stepCounter) return;
                linkedListVis.highlightLinks({
                    source: step._index,
                    target: step._index + 1
                });
            },
        });
        return {
            node: null,
            index: null,
            steps
        };
    }

    getNodeBeforeIndex(index, heading, codeLabelPrefix) {
        var steps = [];
        if (this.head == null) return {
            node: null,
            index: null,
            steps
        };

        if (index === 0) return {
            node: this.head,
            index: null,
            steps
        };

        let current = this.head;
        let currentIndex = 0;

        //current pointer head
        steps.push({
            array: this.toArray(),
            heading: heading,
            description: `Index is not 0, so it is not the head Node`,
            _index: currentIndex,
            codeLabel: [`${codeLabelPrefix}-set-current-index`, `${codeLabelPrefix}-current-head`],
            animation: async (linkedListVis, duration, step) => {
                linkedListVis.highlightLinks({
                    source: "head",
                    target: step._index
                });
                linkedListVis.setCurrentPointer(step._index, duration, true);
            },
        });

        while (current.next != null) {
            if (currentIndex + 1 === index) {
                steps.push({
                    array: this.toArray(),
                    heading: heading,
                    description: `Index ${index} is the index of current.next`,
                    _index: currentIndex,
                    codeLabel: [`${codeLabelPrefix}-while`, `${codeLabelPrefix}-if-index`, `${codeLabelPrefix}-found`],
                    animation: async (linkedListVis, duration, step, visContainer) => {
                        const stepCounter = visContainer.stepCounter;
                        if (step._index === 0) await linkedListVis.setCurrentPointer(step._index, 0, true);
                        else {
                            await linkedListVis.setCurrentPointer(step._index - 1, 0, true);
                            await linkedListVis.setCurrentPointer(step._index, duration, true);
                        }
                        if (stepCounter != visContainer.stepCounter) return;
                        linkedListVis.highlightLinks({
                            source: step._index,
                            target: step._index + 1
                        });
                        linkedListVis.highlightElements(step._index + 1);
                    },
                });
                return {
                    node: current,
                    index: currentIndex,
                    steps
                };
            }
            steps.push({
                array: this.toArray(),
                heading: heading,
                description: `Go through list until the index of current.next is equal to ${index}`,
                _index: currentIndex,
                codeLabel: [`${codeLabelPrefix}-while`, `${codeLabelPrefix}-increment-current-index`, `${codeLabelPrefix}-current-next`],
                animation: async (linkedListVis, duration, step, visContainer) => {
                    const stepCounter = visContainer.stepCounter;
                    if (step._index === 0) await linkedListVis.setCurrentPointer(step._index, 0, true);
                    else {
                        await linkedListVis.setCurrentPointer(step._index - 1, 0, true);
                        await linkedListVis.setCurrentPointer(step._index, duration, true);
                    }
                    if (stepCounter != visContainer.stepCounter) return;
                    linkedListVis.highlightLinks({
                        source: step._index,
                        target: step._index + 1
                    });
                },
            });
            currentIndex++;
            //current pointer weiterschieben
            current = current.next;
        }
        steps.push({
            array: this.toArray(),
            heading: heading,
            description: `current.next is null, therefore there is no Node with index ${index} in the list`,
            _index: currentIndex,
            codeLabel: [`${codeLabelPrefix}-while`, `${codeLabelPrefix}-not-found`],
            animation: async (linkedListVis, duration, step, visContainer) => {
                const stepCounter = visContainer.stepCounter;
                if (step._index === 0) await linkedListVis.setCurrentPointer(step._index, 0, true);
                else {
                    await linkedListVis.setCurrentPointer(step._index - 1, 0, true);
                    await linkedListVis.setCurrentPointer(step._index, duration, true);
                }
                if (stepCounter != visContainer.stepCounter) return;
                linkedListVis.highlightLinks({
                    source: step._index,
                    target: step._index + 1
                });
            },
        });
        return {
            node: current,
            index: currentIndex,
            steps
        };
    }

    toArray() {
        const array = [];
        let current = this.head;
        while (current != null) {
            array.push({
                data: current.data,
                id: current.id
            });
            current = current.next;
        }
        return array;
    }
}