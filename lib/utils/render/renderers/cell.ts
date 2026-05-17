import { getValue } from "@/lib/utils/object";
import type { DisplayFieldDefinition, ValueFormatter } from "../types";

const VALUE_TYPE_FORMATTERS: {
	string: ValueFormatter<string>;
	number: ValueFormatter<number>;
	boolean: ValueFormatter<boolean>;
	object: ValueFormatter<Record<string, unknown>>;
	date: ValueFormatter<Date>;
	array: ValueFormatter<Array<unknown>>;
} = {
	string: (v) => v,
	number: (v) => String(v),
	boolean: (v) => (v ? "true" : "false"),
	date: (v) => v.toISOString(),
	array: (v) => v.map(formatValue).join(", "),
	object: (v) => JSON.stringify(v),
};

function formatValue(value: unknown): string {
	if (value === null || value === undefined) return "";
	if (value instanceof Date) return VALUE_TYPE_FORMATTERS.date(value, value);
	if (Array.isArray(value)) return VALUE_TYPE_FORMATTERS.array(value, value);

	const type = typeof value;
	if (type === "string")
		return VALUE_TYPE_FORMATTERS.string(value as string, value as string);
	if (type === "number")
		return VALUE_TYPE_FORMATTERS.number(value as number, value as number);
	if (type === "boolean")
		return VALUE_TYPE_FORMATTERS.boolean(value as boolean, value as boolean);
	if (type === "object")
		return VALUE_TYPE_FORMATTERS.object(
			value as Record<string, unknown>,
			value as Record<string, unknown>,
		);

	return String(value);
}

export function renderCell<TObject>(
	item: TObject,
	col: DisplayFieldDefinition<TObject>,
	format?: boolean,
): string {
	const raw = getValue(item, col.key);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	if (!format) return raw as any;
	if (col.format) return col.format(raw, item).trim();
	return formatValue(raw).trim();
}