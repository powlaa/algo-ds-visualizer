import { PseudocodeDisplay } from "../components/PseudocodeDisplay";
import { TableDisplay } from "../components/TableDisplay";
import { ColumnData, Pseudocode, RowData } from "../types";
import { VisContainer } from "../components/VisContainer";

/**
 * Represents a step in the visualization.
 */
interface Step {
	data: number[];
	heading: string;
	description: string;
	/**
	 * The labels of the lines of code to highlight.
	 */
	codeLabel: string[];
	/**
	 * The animation to show for the step.
	 */
	animation: (step: Step) => void;
}

/**
 * View to visualize recursion.
 */
class RecursionView extends HTMLElement {
	// Components.
	private _shadow: ShadowRoot;
	private _visContainer: VisContainer;
	private _splitLayout: SplitLayout;
	private _pseudocodeDisplay: PseudocodeDisplay;
	private _tableDisplay: TableDisplay;

	// Pseudocode.
	private readonly _PSEUDOCODE: Pseudocode[] = [
		{
			code: "n = 3",
			indent: 0,
			label: "variable",
		},
		{
			code: "n_factorial = <b>Factorial</b>(n)",
			indent: 0,
			label: "function-call",
		},
		{
			code: "",
			indent: 0,
			label: "empty",
		},
		{
			code: "<b>Factorial</b>(n as int)",
			indent: 0,
			label: "function",
		},
		{
			code: "<b>if</b> n == 0",
			indent: 1,
			label: "if",
		},
		{
			code: "<b>return</b> 1",
			indent: 2,
			label: "last-return",
		},
		{
			code: "<b>else</b>",
			indent: 1,
			label: "else",
		},
		{
			code: "<b>return</b> n * <b>Factorial</b>(n - 1)",
			indent: 2,
			label: "recursive-call",
		},
	];
	// The number to calculate the factorial of.
	private _n = 3;

	constructor() {
		super();

		// Attach shadow DOM and render the view.
		this._shadow = this.attachShadow({ mode: "open" });
		this._render();

		// Get the components.
		this._visContainer = this._shadow.querySelector(
			"vis-container"
		) as VisContainer;
		this._splitLayout = this._shadow.querySelector(
			"split-layout"
		) as SplitLayout;
		this._tableDisplay = this._shadow.querySelector(
			"table-display"
		) as TableDisplay;
		this._pseudocodeDisplay = this._shadow.querySelector(
			"pseudocode-display"
		) as PseudocodeDisplay;

		// Set the pseudocode.
		this._pseudocodeDisplay.code = this._PSEUDOCODE;

		// Add event listeners.
		this._visContainer.addEventListener("code", () => this._toggleCode());
		this._visContainer.addEventListener("show-step", (e) =>
			this._showStep(e as CustomEvent<{ step: Step }>)
		);
		this._visContainer.addEventListener("start", (e) => {
			this._runRecursion(e as CustomEvent<{ array: number[] }>);
		});

		// Start the visualization.
		this._runRecursion();
	}

	/**
	 * Shows a specific step in the visualization.
	 * @param e - The event.
	 */
	private _showStep(e: CustomEvent<{ step: Step }>) {
		const step = e.detail.step;
		step.animation(step);
	}

	/**
	 * Starts the visualization.
	 * @param e - This event is triggered when the start button is clicked.
	 */
	private _runRecursion(e?: CustomEvent<{ array: number[] }>): void {
		// Get the input from the event if it was triggered.
		if (e) {
			this._n = e.detail.array[0];

			// Adjust pseudocode in first line to match the input.
			this._PSEUDOCODE[0].code = `n = ${this._n}`;
			this._pseudocodeDisplay.code = this._PSEUDOCODE;
		}

		// Show the table.
		this._showTable();

		this._visContainer.updateSteps(this._recursiveFactorial(), {
			currentStep: 0,
		});
	}

	/**
	 * Starts the visualization.
	 */
	private _recursiveFactorial(): Step[] {
		// The order of steps.
		let stepOrder: Step[] = [
			{
				data: [],
				heading: `Calculate the factorial`,
				description: "",
				codeLabel: [],
				animation: (step) => this._updateVis(step),
			},
			{
				data: [],
				heading: `Calculate the factorial of n = ${this._n} with the help of the Factorial function`,
				description: "",
				codeLabel: ["variable", "function-call"],
				animation: (step) => this._updateVis(step),
			},
		];

		// First function call with n.
		stepOrder.push({
			data: [this._n],
			heading: `Factorial(${this._n}) is invoked`,
			description: `Factorial(${this._n}) is added to the call stack.`,
			codeLabel: ["function"],
			animation: (step) => this._updateVis(step),
		});

		// Start the factorial recursion and build the order of steps.
		const data: number[] = [this._n];
		const buildSteps = (data: number[]): number => {
			const n = data[0];
			// Base case check.
			const isBaseCase = n === 0;

			stepOrder.push({
				data: [...data],
				heading: "Check if n is 0",
				description: `n is currently ${n}, so the statement is ${isBaseCase}.`,
				codeLabel: ["if"],
				animation: (step) => this._updateVis(step),
			});

			// Base case.
			if (n === 0) {
				stepOrder.push({
					data: [...data],
					heading: "Return 1 because the base case is reached",
					description: "",
					codeLabel: ["last-return"],
					animation: (step) => this._updateVis(step),
				});
				data.shift();
				// Pop the call stack.
				stepOrder.push({
					data: [...data],
					heading:
						"Factorial(0) returns 1 and is popped from the call stack.",
					description: "The result can be multiplied by 1 now.",
					codeLabel: ["recursive-call"],
					animation: (step) => this._updateVis(step),
				});

				return 1;
			}
			// Recursive case.
			stepOrder.push({
				data: [...data],
				heading: `Recursively call Factorial(${n - 1})`,
				description: `The result will be multiplied by ${n}.`,
				codeLabel: ["recursive-call"],
				animation: (step) => this._updateVis(step),
			});

			data.unshift(n - 1);
			stepOrder.push({
				data: [...data],
				heading: `Invoke Factorial(${n - 1})`,
				description: `Add Factorial(${n - 1}) to the call stack.`,
				codeLabel: ["function"],
				animation: (step) => this._updateVis(step),
			});

			const result = n * buildSteps(data);
			data.shift();

			// Pop the call stack.
			stepOrder.push({
				data: [...data],
				heading: `Factorial(${n}) returns ${result} and is popped from the call stack`,
				description:
					n === this._n
						? ""
						: `The result can be multiplied by ${n + 1} now.`,
				codeLabel: ["recursive-call"],
				animation: (step) => this._updateVis(step),
			});

			return result;
		};

		// Start the factorial recursion and build the order of steps.
		const factorial = buildSteps(data);

		// Last step.
		stepOrder.push({
			data: [],
			heading: `All done! The factorial of n is ${factorial}`,
			description: "",
			codeLabel: ["function-call"],
			animation: (step) => this._updateVis(step),
		});

		return stepOrder;
	}

	/**
	 * Updates the visualization.
	 * @param step - The step to show.
	 */
	private _updateVis(step: Step) {
		// Update the visualization.
		if (step.codeLabel)
			this._pseudocodeDisplay.highlightLine(...step.codeLabel);
		else this._pseudocodeDisplay.highlightLine();

		// Update the table.
		this._updateTable(step.data);
	}

	/**
	 * Shows the table.
	 */
	private _showTable() {
		// Add one column with the title "Call Stack".
		const columnsData: ColumnData[] = [{ id: "1", title: "Call Stack" }];
		this._tableDisplay.showTable(columnsData);
	}

	/**
	 * Updates the table, so a new row is added on top to show the most recent function call, e.g. Factorial(3)
	 * @param tableData - The data to show in the table.
	 */
	private _updateTable(tableData: number[]) {
		// Add the data to the table.
		const rowsData: RowData[][] = tableData.map((value, index) => [
			{ column: "1", value: `Factorial(${value})`, row: `${index + 1}` },
		]);

		// Update the table.
		this._tableDisplay.updateRows(rowsData);
	}

	/**
	 * Toggles the code display.
	 */
	private _toggleCode() {
		this._pseudocodeDisplay.toggleCode();
		this._splitLayout.toggleLeftResizerVertical();
		this._splitLayout.setTopLeftHeight(50);
	}

	private _render = () => {
		// Style of the view.
		const style = `
			<style>
				.content {
					width: 100%;
					--split-layout-height: calc(100% - 190px);
				}
				.content__table-display {
					overflow: auto;
					text-align: center;
				}

				.content__pseudocode {
					width: 100%;
				}
			</style>
		`;

		// HTML of the view.
		this._shadow.innerHTML =
			`
			<vis-container title="Recursion" start-btn-name="Start" array-input>
				<!-- Default layout  -->
				<split-layout class="content">
					<table-display slot="left" class="content__table-display"></table-display>
					<pseudocode-display slot="right" class="content__pseudocode"></pseudocode-display>
				</split-layout>
			</vis-container>
		` + style;
	};
}

// Register the custom element.
customElements.define("recursion-view", RecursionView);
