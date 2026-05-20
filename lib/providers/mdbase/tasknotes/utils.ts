import { TASKNOTES_FIELDS_DEFAULTS } from "../constants";
import type {
	FieldDefinition,
	TypeDefinition,
} from "../types";
import type { TaskNotesFieldRole } from "./types";

export function getTaskNotesFields<
	T extends TaskNotesFieldRole = TaskNotesFieldRole,
>(
	typeDef: TypeDefinition,
	roles: (T | undefined)[] = Object.keys(TASKNOTES_FIELDS_DEFAULTS) as T[],
): Record<T, { key: string; field: FieldDefinition }> {

	return roles.reduce(
		(acc, role) => {
			if (!role) {
				return acc;
			}

			return Object.assign(acc, {
				[role]: getTaskNotesField(typeDef, role),
			});
		},
		{} as Record<T, { key: string; field: FieldDefinition }>,
	);
}

export function getTaskNotesField(
	typeDef: TypeDefinition,
	role: TaskNotesFieldRole,
) {
	if (!typeDef.fields) {
		throw new Error("Invalid TaskNotes typedef");
	}

	let key: string = role;
	let field: FieldDefinition = TASKNOTES_FIELDS_DEFAULTS[role];

	for (const [fKey, fDef] of Object.entries(typeDef.fields)) {
		if (fDef.tn_role === role) {
			key = fKey;
			field = fDef;
			break;
		}
	}

	return {
		key,
		field,
	};
}
