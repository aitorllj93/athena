import type { DisplayFieldDefinition, RenderOptions } from "../types";
import { renderCell } from "./cell";

export function renderMdTable<TObject>(
	items: TObject[],
	columns: DisplayFieldDefinition<TObject>[],
	{
		includeKeys = true,
		formatKeys = false,
		formatValues = true,
	}: RenderOptions = {},
): string {
	const escapeCell = (s: string) => s.replace(/\|/g, "\\|");
	const row = (cells: string[]) => `| ${cells.map(escapeCell).join(" | ")} |`;

	const lines: string[] = [];

	if (includeKeys) {
		lines.push(row(columns.map((c) => c.label)));
		lines.push(row(columns.map(() => "---")));
	}

	for (const item of items) {
		lines.push(row(columns.map((col) => renderCell(item, col, formatValues))));
	}

	return lines.join("\n");
}
