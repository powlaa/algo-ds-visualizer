import { PseudocodeDisplay } from "../components/PseudocodeDisplay";
import { TableDisplay } from "../components/TableDisplay";
import { Pseudocode } from "../types";
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
		this._visContainer.addEventListener(
			"code",
			this._toggleCode.bind(this)
		);

		// Create dummy data for the table.
		const columnsData = [{ id: "1", title: "Call Stack" }];
		const rowsData = [
			[{ column: "1", value: "Row 1", row: "1" }],
			[{ column: "1", value: "Row 2", row: "2" }],
		];

		// Show the dummy table.
		if (this._tableDisplay) {
			this._tableDisplay.showTable(columnsData, rowsData);
		}

		// Start the visualization.
		this._recurse();
	}

	/**
	 * Starts the visualization.
	 * @param data - The number to calculate the factorial of.
	 */
	_recurse(data: number = 3): void {
		this._visContainer.updateSteps(this._recursiveFactorial(data), {
			currentStep: 0,
		});
	}

	/**
	 * Starts the visualization.
	 * @param n - The number to calculate the factorial of.
	 */
	_recursiveFactorial(data: number): Step[] {
		let stepOrder: Step[] = [
			{
				data: [data],
				heading: `Calculate the factorial of n = ${data} with the help of the Factorial function`,
				description: "",
				codeLabel: ["variable", "function-call"],
				animation: (step) => this._updateVis(step),
			},
		];

		// First function call with n.
		stepOrder.push({
			data: [data],
			heading: `Factorial(${data}) is invoked`,
			description: `Factorial(${data}) is added to the call stack.`,
			codeLabel: ["function"],
			animation: (step) => this._updateVis(step),
		});

		// Start the factorial recursion and build the order of steps.
		const buildSteps = (n: number): number => {
			const isBaseCase = n === 0; // Indicate if the base case is reached.

			// Base case check.
			stepOrder.push({
				data: [n],
				heading: "Check if n is 0",
				description: `n is currently ${n}, so the statement is ${isBaseCase}.`,
				codeLabel: ["if"],
				animation: (step) => this._updateVis(step),
			});

			if (n === 0) {
				// Base case.
				stepOrder.push({
					data: [n],
					heading: "Return 1 because the base case is reached",
					description: "",
					codeLabel: ["last-return"],
					animation: (step) => this._updateVis(step),
				});

				return 1;
			}

			// Recursive call.
			stepOrder.push({
				data: [n],
				heading: `Recursively call Factorial(${n - 1})`,
				description: `The result will be multiplied by ${n}.`,
				codeLabel: ["recursive-call"],
				animation: (step) => this._updateVis(step),
			});
			stepOrder.push({
				data: [n],
				heading: `Invoke Factorial(${n - 1})`,
				description: `Add Factorial(${n - 1}) to the call stack.`,
				codeLabel: ["function"],
				animation: (step) => this._updateVis(step),
			});

			const result = n * buildSteps(n - 1);

			// Pop the call stack.
			stepOrder.push({
				data: [n],
				heading: `Factorial(${n}) returns ${result} and is popped from the call stack`,
				description:
					n === data ? "" : "The result can be multiplied by n now.",
				codeLabel: ["recursive-call"],
				animation: (step) => this._updateVis(step),
			});

			return result;
		};

		// Start the factorial recursion and build the order of steps.
		const factorial = buildSteps(data);

		console.log("Factorial of 3", factorial);

		// Last step.
		stepOrder.push({
			data: [data],
			heading: `All done! The factorial of n is ${factorial}`,
			description: "",
			codeLabel: ["function-call"],
			animation: (step) => this._updateVis(step),
		});

		return stepOrder;
	}

	_updateVis(step: Step) {
		// Update the visualization.
	}

	/**
	 * Toggles the code display.
	 */
	_toggleCode() {
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
				width: 50%;
				overflow: auto;
			}
			.content__pseudocode {
				width: 100%;
			}
		</style>
	`;

		// HTML of the view.
		this._shadow.innerHTML =
			`
			<vis-container title="Recursion" no-start-btn>
				<!-- Default layout  -->
				<split-layout class="content">
					<!-- <callstack-display slot="left" class="content__callstack-display"></callstack-display> -->
					<table-display slot="left" class="content__table-display"></table-display>
					<pseudocode-display slot="right" class="content__pseudocode"></pseudocode-display>
				</split-layout>
			</vis-container>
		` + style;
	};
}

// Register the custom element.
customElements.define("recursion-view", RecursionView);
