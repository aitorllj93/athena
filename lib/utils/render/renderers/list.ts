import type { DisplayFieldDefinition, RenderOptions } from "../types";
import { renderCell } from "./cell";

export function renderMdList<TObject>(
	items: TObject[],
	columns: DisplayFieldDefinition<TObject>[],
	{
		includeKeys = true,
		formatKeys = true,
		formatValues = true,
	}: RenderOptions = {},
): string {
	const renderKey = (col: DisplayFieldDefinition<TObject>) =>
		includeKeys ?
			`**${formatKeys ? col.label : col.key}**: ` :
			'';

	return items
		.map((item) =>
			columns
				.map((col, idx) => `${idx === 0 ? "- " : "  "}${renderKey(col)}${renderCell(item, col, formatValues)}`)
				.join("\n"),
		)
		.join("\n");
}
