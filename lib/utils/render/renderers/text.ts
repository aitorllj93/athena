import type { DisplayFieldDefinition, RenderOptions } from "../types";
import { renderCell } from "./cell";

export function renderText<TObject>(
  items: TObject[],
  columns: DisplayFieldDefinition<TObject>[],
  {
    includeKeys = false,
    formatKeys = true,
    formatValues = true,
  }: RenderOptions = {},
): string {
  const lines: string[] = [];

  if (includeKeys) {
    lines.push(columns.map((c) => formatKeys ? c.label : c.key).join("\t"));
  }

  for (const item of items) {
    lines.push(columns.map((col) => renderCell(item, col, formatValues)).filter(Boolean).join("\t"));
  }

  return lines.join("\n");
}