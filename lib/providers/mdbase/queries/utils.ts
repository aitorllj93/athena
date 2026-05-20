import {
	type FieldDefinition,
	isDateDefinition,
	isDateTimeDefinition,
	isEnumDefinition,
	isIntegerDefinition,
	isLinkDefinition,
	isListDefinition,
	isObjectDefinition,
	isStringDefinition,
} from "../types";

export type QueryExpression = string | Record<string, unknown>;

export const intersection = (
	expresions: QueryExpression[],
): QueryExpression => {
	if (Array.isArray(expresions)) {
		if (expresions.length === 1) {
			return expresions[0] as QueryExpression;
		}

		return {
			and: expresions,
		};
	}

	return expresions;
};
export const union = (
	expresions: QueryExpression[] | QueryExpression,
): QueryExpression => {
	if (Array.isArray(expresions)) {
		if (expresions.length === 1) {
			return expresions[0] as QueryExpression;
		}

		return {
			or: expresions,
		};
	}

	return expresions;
};

export const negation = (
	expression: string,
): string => {
	return `!${expression}`;
}

export const strEquals = (field: string, value: string) =>
	`${field} === ${value}`;
export const strDiffers = (field: string, value: string) =>
	`${field} != ${value}`;
export const dateEquals = (field: string, value: string) =>
	`date(${field}) == ${value}`;
export const dateLower = (field: string, value: string) =>
	`date(${field}) < ${value}`;
export const arrContains = (field: string, value: string) =>
	`${field}.contains(${value})`;

export function normalizeQueryValue(
	value: unknown,
	fieldDef: FieldDefinition,
): string {
	if (isStringDefinition(fieldDef)) {
		return `"${value}"`;
	}

	if (isEnumDefinition(fieldDef)) {
		return `"${value}"`;
	}

	if (isDateDefinition(fieldDef)) {
		return `date("${value}")`;
	}

	if (isListDefinition(fieldDef)) {
		if (Array.isArray(value)) {
			throw new Error(`normalizeQueryValue does not support arrays yet`);
		}

		return normalizeQueryValue(value, fieldDef.items);
	}

	if (isObjectDefinition(fieldDef)) {
		throw new Error(`normalizeQueryValue does not support objects yet`);
	}

	if (isLinkDefinition(fieldDef)) {
		return `"[[${value}]]"`;
	}

	if (isIntegerDefinition(fieldDef)) {
		return (value as number).toString();
	}

	if (isDateTimeDefinition(fieldDef)) {
		throw new Error(`normalizeQueryValue does not support datetimes yet`);
	}

	return (value as string).toString();
}
