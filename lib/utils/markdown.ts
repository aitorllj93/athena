type ColumnConfig<T> = {
	key: keyof T | string;
	header?: string;
	format?: (value: T[keyof T], row: T) => string;
	align?: "left" | "center" | "right";
};

type MarkdownTableOptions<T> = {
	columns?: ColumnConfig<T>[];
	sortBy?: keyof T | string;
	sortDirection?: "asc" | "desc";
	emptyValue?: string;
};

export function mdTable<T extends Record<string, unknown>>(
	data: T[],
	options: MarkdownTableOptions<T> = {},
): string {
	if (!Array.isArray(data) || data.length === 0) {
		return "No hay datos";
	}

	const { columns, sortBy, sortDirection = "asc", emptyValue = "" } = options;

	const resolvedColumns: ColumnConfig<T>[] =
		columns ??
		Array.from(new Set(data.flatMap((row) => Object.keys(row)))).map((key) => ({
			key,
			header: key,
			align: "left",
		}));

	const rows = [...data];

	if (sortBy) {
		rows.sort((a, b) => {
			const av = a[sortBy];
			const bv = b[sortBy];

			if (av == null) return 1;
			if (bv == null) return -1;

			if (av < bv) return sortDirection === "asc" ? -1 : 1;
			if (av > bv) return sortDirection === "asc" ? 1 : -1;

			return 0;
		});
	}

	const escapeCell = (value: unknown): string => {
		return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
	};

	const header = `| ${resolvedColumns
		.map((c) => c.header ?? String(c.key))
		.join(" | ")} |`;

	const separator = `| ${resolvedColumns
		.map((c) => {
			switch (c.align) {
				case "center":
					return ":---:";
				case "right":
					return "---:";
				default:
					return "---";
			}
		})
		.join(" | ")} |`;

	const body = rows.map((row) => {
		const values = resolvedColumns.map((col) => {
			const raw = row[col.key as keyof T];

			const formatted = col.format ? col.format(raw, row) : (raw ?? emptyValue);

			return escapeCell(formatted);
		});

		return `| ${values.join(" | ")} |`;
	});

	return [header, separator, ...body].join("\n");
}
