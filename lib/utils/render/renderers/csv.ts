import type { DisplayFieldDefinition, RenderOptions } from "../types";
import { renderCell } from "./cell";

export function renderCsv<TObject>(
	items: TObject[],
	columns: DisplayFieldDefinition<TObject>[],
	{
		includeKeys = true,
		formatKeys = false,
		formatValues = false,
	}: RenderOptions = {},
): string {
	const quote = (s: string) =>
		s.includes(",") || s.includes('"') || s.includes("\n")
			? `"${s.replace(/"/g, '""')}"`
			: s;

	const csvRow = (cells: string[]) => cells.map(quote).join(",");
	const lines: string[] = [];

	if (includeKeys) {
		lines.push(csvRow(columns.map((c) => (formatKeys ? c.label : c.key))));
	}

	for (const item of items) {
		lines.push(
			csvRow(columns.map((col) => renderCell(item, col, formatValues))),
		);
	}

	return lines.join("\n");
}
