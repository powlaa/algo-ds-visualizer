import { TableDisplay } from "../components/TableDisplay";
import { Pseudocode } from "./types";

/**
 * View to visualize recursion.
 */
class RecursionView extends HTMLElement {
  private _shadow: ShadowRoot;
  private _pseudocodeDisplay: PseudocodeDisplay | null;
  private _tableDisplay: TableDisplay | null;
  private readonly _PSEUDOCODE: Pseudocode[] = [
    {
      code: "test()",
      indent: 0,
      label: "test",
    },
    {
      code: "x = 1",
      indent: 1,
      label: "x",
    },
  ];

  constructor() {
    super();

    this._shadow = this.attachShadow({ mode: "open" });
    this._render();

    this._tableDisplay = this._shadow.querySelector(
      "table-display"
    ) as TableDisplay;
    this._pseudocodeDisplay = this._shadow.querySelector(
      "pseudocode-display"
    ) as PseudocodeDisplay;
    this._pseudocodeDisplay.code = this._PSEUDOCODE;

    // Create dummy data for the table.
    const columnsData = [{ id: "1", title: "Column 1" }];
    const rowsData = [
      [{ column: "1", value: "Row 1", row: "1" }],
      [{ column: "1", value: "Row 2", row: "2" }],
    ];

    // Show the dummy table.
    if (this._tableDisplay) {
      this._tableDisplay.showTable(columnsData, rowsData);
    }
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
