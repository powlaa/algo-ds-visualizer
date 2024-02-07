/**
 * Includes everything related to the code view.
 */
export interface Pseudocode {
	/**
	 * The line of code.
	 */
	code: string;
	/**
	 * The indentation level of the code.
	 */
	indent: number;
	/**
	 * The label for the line of code.
	 */
	label: string;
}
/**
 * Represents a column in a table.
 */
export interface ColumnData {
	id: string;
	title: string;
}
/**
 * Represents a row section in a table.
 */
export interface RowData {
	column: string;
	value: string;
	row: string;
}
/**
 * Specifies the highlighted section of a table.
 */
export interface TableHighlight {
	row: string;
	column: string;
}
