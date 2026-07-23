import type {
	Collection as MdbaseCollection,
	MdbaseConfig,
	FieldDefinition as MdbaseFieldDefinition,
	TypeDefinition as MdbaseTypeDefinition,
} from "@callumalpass/mdbase";

export type Config = MdbaseConfig;

export type Collection = MdbaseCollection;

export type BaseFieldDefinition = MdbaseFieldDefinition & {
	type:
		| "string"
		| "enum"
		| "date"
		| "list"
		| "object"
		| "link"
		| "integer"
		| "datetime";
	description?: string;
	tn_role?: string;
};

export type StringFieldDefinition = BaseFieldDefinition & {
	type: "string";
};

export type EnumFieldDefinition<TEnum = string> = BaseFieldDefinition & {
	type: "enum";
	values: TEnum[];
	default?: TEnum;
	tn_completed_values?: TEnum[];
};

export type DateFieldDefinition = BaseFieldDefinition & {
	type: "date";
};

export type ListFieldDefinition = BaseFieldDefinition & {
	type: "list";
	items: FieldDefinition;
};

export type ObjectFieldDefinition = BaseFieldDefinition & {
	type: "object";
	fields: Record<string, FieldDefinition>;
};

export type LinkFieldDefinition = BaseFieldDefinition & {
	type: "link";
};

export type IntegerFieldDefinition = BaseFieldDefinition & {
	type: "integer";
};

export type DateTimeFieldDefinition = BaseFieldDefinition & {
	type: "datetime";
};

export type ScalarFieldDefinition = 
	| StringFieldDefinition
	| EnumFieldDefinition
	| ListFieldDefinition
	| LinkFieldDefinition
	| IntegerFieldDefinition
	| DateTimeFieldDefinition;

/**
 * Override FielDefinition with TaskNotes role
 */
export type FieldDefinition =
	| StringFieldDefinition
	| EnumFieldDefinition
	| DateFieldDefinition
	| ListFieldDefinition
	| ObjectFieldDefinition
	| LinkFieldDefinition
	| IntegerFieldDefinition
	| DateTimeFieldDefinition;

export function isStringDefinition(definition: FieldDefinition): definition is StringFieldDefinition {
	return definition.type === "string";
}
export function isEnumDefinition(definition: FieldDefinition): definition is EnumFieldDefinition {
	return definition.type === "enum";
}
export function isDateDefinition(definition: FieldDefinition): definition is DateFieldDefinition {
	return definition.type === "date";
}
export function isListDefinition(definition: FieldDefinition): definition is ListFieldDefinition {
	return definition.type === "list";
}
export function isObjectDefinition(definition: FieldDefinition): definition is ObjectFieldDefinition {
	return definition.type === "object";
}
export function isLinkDefinition(definition: FieldDefinition): definition is LinkFieldDefinition {
	return definition.type === "link";
}
export function isIntegerDefinition(definition: FieldDefinition): definition is IntegerFieldDefinition {
	return definition.type === "integer";
}
export function isDateTimeDefinition(definition: FieldDefinition): definition is DateTimeFieldDefinition {
	return definition.type === "datetime";
}

export function isScalarDefinition(definition: FieldDefinition): definition is ScalarFieldDefinition {
	return !(isObjectDefinition(definition) || isListDefinition(definition));
};

/**
 * We cannot use the mdbase `TypeDefinition` because we need a custom field for the archive path.
 */
export type TypeDefinition = MdbaseTypeDefinition & {
	archive_path_pattern?: string;
	fields?: Record<string, FieldDefinition>;
};

export type QueryResult<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	path: string;
	type: string;
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
} & T;

export type ReadResult<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	file: {
		path: string;
	};
	frontmatter?: Record<string, unknown>;
	types: string[];
	body?: string | null;
} & T;

export type QueryResultGroup<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	key: string;
	results: QueryResult<T>[];
};