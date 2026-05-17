import type { DeepKeys, DeepValue } from "@/lib/utils/object";

/**
 * Output format.
 * `json`: Array of items
 * `md`: Markdown table (alias to mdtable)
 * `mdtable`: Markdown table
 * `mdlist`: Markdown list
 * `mdcheck`: Markdown checkbox list
 * `text`: Plain text list (One line per row)
 * `csv`: Comma separated values
 */
export type Format =
	| "json"
	| "md"
	| "mdtable"
	| "mdlist"
	| "mdcheck"
	| "text"
	| "csv";

export type ValueFormatter<TVal = unknown, TObj = unknown> = (
	v: TVal,
	o: TObj,
) => string;

export type RenderFn = <TObject>(
	items: TObject[],
	columns: DisplayFieldDefinition<TObject>[],
	opts?: RenderOptions 
) => string;
export type RenderOptions = {
	includeKeys?: boolean;
	formatKeys?: boolean;
	formatValues?: boolean;
};

/**
 * The definition for each field
 */
export type DisplayFieldDefinition<
	TObject,
	TKey extends DeepKeys<TObject> = DeepKeys<TObject>,
> = {
	/**
	 * The nested key from the object
	 */
	key: TKey;
	/**
	 * The header label
	 */
	label: string;
	/**
	 * The order of this field. Definitions with order will go first. Those without order will fallback after them based on their position in the definitions array.
	 */
	order?: number;
	/**
	 * A custom formatter for the value
	 */
	format?: ValueFormatter<DeepValue<TObject, TKey>, TObject>;
};
