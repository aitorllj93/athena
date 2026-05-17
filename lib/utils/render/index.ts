import type { DeepKeys } from "@/lib/utils/object";

import { RENDERERS } from "./renderers";
import type { DisplayFieldDefinition, Format, RenderOptions } from "./types";

export * from "./types";

function sortColumns<TObject>(
	definitions: DisplayFieldDefinition<TObject>[],
): DisplayFieldDefinition<TObject>[] {
	return [...definitions].sort((a, b) => {
		const aHasOrder = a.order !== undefined;
		const bHasOrder = b.order !== undefined;
		// biome-ignore lint/style/noNonNullAssertion: checked
		if (aHasOrder && bHasOrder) return a.order! - b.order!;
		if (aHasOrder) return -1;
		if (bHasOrder) return 1;
		return 0; // preserve original array order for ties
	});
}

type RenderParams<TObject> = {
	columnDefinitions: DisplayFieldDefinition<TObject>[];
	format?: Format;
	fields?: DeepKeys<TObject>[];
};
export function render<TObject = unknown>(
	items: TObject[],
	params: RenderParams<TObject>,
	opts?: RenderOptions,
): string {
	const { columnDefinitions, fields, format = "text" } = params;

	let columns = columnDefinitions;

	if (fields) {
		columns = columns.filter(c => fields.includes(c.key));
	}

	columns = sortColumns(columns);

	return RENDERERS[format](items, columns, opts);
}


function formatGroupMinimal(group: string) {
	return group
}

function formatGroupRegular(group: string) {
	return `### ${group}
`;
}

export function formatGroup(group: string, format?: Format) {
	if (format === "md" || format === "mdlist" || format === "mdcheck") {
		return formatGroupRegular(group);
	}
	return formatGroupMinimal(group);
}


export function renderGroup<TObject = unknown>(
	title: string,
	items: TObject[],
	params: RenderParams<TObject>,
	opts?: RenderOptions,
): string {
	let out = `${formatGroup(title)}\n\n`;
	out += render(items, params, opts);

	return out;
}
