class LinkedListView extends HTMLElement {
    _ANIMATION_DURATION = 1000;
    _EXAMPLE_DATA = [5, 3, 7, 11];
    _PSEUDOCODE_CLASSES = {
        singly: [
            { code: "<b>class</b> Node", indent: 0, label: "node-class" },
            { code: "data: String", indent: 1, label: "node-data" },
            { code: "next: Node", indent: 1, label: "node-next" },
            { code: "<b>constructor</b>(given_data)", indent: 1, label: "node-init" },
            { code: "data = given_data", indent: 2, label: "node-set-data" },
            { code: "next = null", indent: 2, label: "node-set-next" },
            { code: "", indent: 0, label: "empty" },
            { code: "<b>class</b> SinglyLinkedList", indent: 0, label: "singlylinkedlist-class" },
            { code: "head: Node", indent: 1, label: "singlylinkedlist-head" },
            { code: "<b>constructor</b>()", indent: 1, label: "singlylinkedlist-init" },
            { code: "head = null", indent: 2, label: "singlylinkedlist-set-head" },
            { code: "", indent: 0, label: "empty" },
            { code: "list = new SinglyLinkedList()", indent: 0, label: "singlylinkedlist-instantiation" },
        ],
    };

    _CONTROL_PANEL_METHODS = [
        {
            name: "add",
            parameters: [
                { name: "data", type: "text" },
                { name: "index", type: "number" },
            ],
        },
        {
            name: "delete",
            parameters: [{ name: "data", type: "text" }],
        },
    ];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this._render();

        this._visContainer = this.shadowRoot.querySelector("vis-container");
        this._linkedListVis = this.shadowRoot.querySelector("linked-list");
        this._pseudocodeDisplay = this.shadowRoot.querySelector("pseudocode-display");
        this._pseudocodeDisplay.code = this._PSEUDOCODE_CLASSES.singly;
        this._controlPanel = this.shadowRoot.querySelector("control-panel");
        this._controlPanel.data = this._CONTROL_PANEL_METHODS;

        this._visContainer.addEventListener("show-step", this._showStep.bind(this));

        this._controlPanel.addEventListener("add", (e) => this._addSteps(this._linkedList.add(e.detail.params.data)));

        this._controlPanel.addEventListener("delete", (e) => this._addSteps(this._linkedList.delete(e.detail.params.data)));
        this._initVis();
    }

    async _showStep(e) {
        this._linkedListVis.data = e.detail.step.array;
        await this._linkedListVis.updateLinkedList();
        await e.detail.step.animation(this._linkedListVis, this._ANIMATION_DURATION, e.detail.step);
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
        this._linkedList.add("23");
        this._linkedList.add("22");
        this._linkedList.add("15");
        this._visContainer.updateSteps(
            [
                {
                    heading: "Singly Linked List",
                    description: "",
                    array: this._linkedList.toArray(),
                    animation: () => {},
                },
            ],
            { currentStep: 0 }
        );
        this._linkedListVis.data = this._linkedList.toArray();
        this._linkedListVis.updateLinkedList();
        this._linkedListVis.center();
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
                    --pseudocode-highlight-background-color: #b0e2d9;
                    --pseudocode-highlight-background-color-alternate: #b0e2d9aa;
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
            <vis-container title="Linked List" no-start-btn locked popup-template-id="${this.getAttribute("popup-template-id")}">
                <split-layout class="content" top-bottom-left>
                    <control-panel slot="top-left" class="content__control-panel"></control-panel>
                    <pseudocode-display slot="bottom-left" class="content__pseudocode"></pseudocode-display>
                    <linked-list slot="right" class="content__linked-list"></linked-list>
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
    add(data) {
        var steps = [];
        const newNode = new SinglyNode(data, this.idct++);
        if (this.head == null) {
            //set head to new node
            this.head = newNode;
        } else {
            //show new node, set next to head
            steps.push({
                array: this.toArray(),
                heading: "Add new element " + data,
                description: "Set next of new element to head",
                animation: (linkedListVis, duration) => {
                    linkedListVis.addElement(data, duration);
                },
            });
            newNode.next = this.head;
            //set head to new node
            steps.push({
                array: this.toArray(),
                heading: "Add new element " + data,
                description: "Set head to new element",
                animation: async (linkedListVis, duration) => {
                    await linkedListVis.addElement(data);
                    linkedListVis.updateLinkedList(duration);
                },
            });
            this.head = newNode;
        }
        return steps;
    }
    delete(data) {
        var steps = [];
        if (this.head == null) return steps;

        if (this.head.data == data) {
            //delete first element
            steps.push({
                array: this.toArray(),
                heading: "Delete element " + data,
                description: `${data} is in head, move head to head.next`,
                animation: async (linkedListVis, duration) => {
                    linkedListVis.highlightElements(0);
                    await linkedListVis.moveLink({ source: "head", target: 0, newTarget: 1 }, duration);
                },
            });

            steps.push({
                array: this.toArray(),
                heading: `Element ${data} is deleted`,
                description: `${data} is removed because no element is pointing to it anymore`,
                animation: async (linkedListVis, duration, step) => {
                    await linkedListVis.moveLink({ source: "head", target: 0, newTarget: 1 });
                    linkedListVis.reset();
                    linkedListVis.data = linkedListVis.data.filter((el, index) => index !== 0);
                    await linkedListVis.updateLinkedList(duration);
                },
            });
            this.head = this.head.next;
            return steps;
        }
        let current = this.head;
        let index = 0;
        //current pointer head
        steps.push({
            array: this.toArray(),
            heading: "Delete element " + data,
            description: `Data is not in head, so go through list until ${data} is found in the next element`,
            _index: index,
            animation: async (linkedListVis, duration, step) => {
                linkedListVis.highlightLinks({ source: "head", target: step._index });
                linkedListVis.setCurrentPointer(step._index, duration);
            },
        });

        while (current.next != null) {
            if (current.next.data == data) {
                steps.push({
                    array: this.toArray(),
                    heading: "Delete element " + data,
                    description: `${data} is found in the next element of the current one`,
                    _index: index,
                    animation: async (linkedListVis, duration, step) => {
                        if (step._index === 0) await linkedListVis.setCurrentPointer(step._index);
                        else {
                            await linkedListVis.setCurrentPointer(step._index - 1);
                            await linkedListVis.setCurrentPointer(step._index, duration);
                        }
                        linkedListVis.highlightLinks({ source: step._index, target: step._index + 1 });
                        linkedListVis.highlightElements(step._index + 1);
                    },
                });
                steps.push({
                    array: this.toArray(),
                    heading: "Delete element " + data,
                    description: `Set next pointer of current to the next of ${data}`,
                    _index: index,
                    animation: async (linkedListVis, duration, step) => {
                        await linkedListVis.setCurrentPointer(step._index);
                        linkedListVis.highlightLinks({ source: step._index, target: step._index + 1 });
                        linkedListVis.highlightElements(step._index + 1);
                        await linkedListVis.moveLink({ source: step._index, target: step._index + 1, newTarget: step._index + 2 }, duration);
                    },
                });

                steps.push({
                    array: this.toArray(),
                    heading: `Element ${data} is deleted`,
                    description: `${data} is removed because no element is pointing to it anymore`,
                    _index: index,
                    animation: async (linkedListVis, duration, step) => {
                        await linkedListVis.moveLink({ source: step._index, target: step._index + 1, newTarget: step._index + 2 }, 1);
                        linkedListVis.reset();
                        linkedListVis.data = linkedListVis.data.filter((el, index) => index !== step._index + 1);
                        await linkedListVis.updateLinkedList(duration);
                    },
                });
                current.next = current.next.next;
                return steps;
            }
            steps.push({
                array: this.toArray(),
                heading: "Delete element " + data,
                description: `Go through list until current.next.data equals ${data}`,
                _index: index,
                animation: async (linkedListVis, duration, step) => {
                    if (step._index === 0) await linkedListVis.setCurrentPointer(step._index);
                    else {
                        await linkedListVis.setCurrentPointer(step._index - 1);
                        await linkedListVis.setCurrentPointer(step._index, duration);
                    }
                    linkedListVis.highlightLinks({ source: step._index, target: step._index + 1 });
                },
            });
            index++;
            //current pointer weiterschieben
            current = current.next;
        }
    }

    toArray() {
        const array = [];
        let current = this.head;
        while (current != null) {
            array.push({ data: current.data, id: current.id });
            current = current.next;
        }
        return array;
    }
}
