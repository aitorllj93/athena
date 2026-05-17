import type { DisplayFieldDefinition, RenderOptions } from "../types";
import { renderCell } from "./cell";

export function renderJson<TObject>(
	items: TObject[],
	columns: DisplayFieldDefinition<TObject>[],
	{
		includeKeys = true,
		formatKeys = false,
		formatValues = false,
	}: RenderOptions = {},
): string {
	const rows = items.map((item) =>
		Object.fromEntries(
			columns.map((col) => [col.key, renderCell(item, col, formatValues)]),
		),
	);
	return JSON.stringify(rows, null, 2);
}
