import { loadConfig } from "@callumalpass/mdbase";
import type { ExtendedTaskNotesFieldRole } from "./tasknotes";
import type {
	Collection,
	Config,
	FieldDefinition,
	TypeDefinition,
} from "./types";
import { getType, openCollection } from "./utils";

export class Mdbase {
	private constructor(
		public readonly root: string,
		public collection: NonNullable<Collection>,
	) {}

	public resolvePath(
		typeDef: TypeDefinition,
		fields: Record<
			ExtendedTaskNotesFieldRole,
			{ key: string; field: FieldDefinition }
		>,
		title: string,
	) {
		if (!typeDef.path_pattern) {
			throw new Error("path_pattern is not defined");
		}
		return typeDef.path_pattern.replace(`{${fields.title.key}}`, title);
	}

	public resolveArchivePath(
		typeDef: TypeDefinition,
		fields: Record<
			ExtendedTaskNotesFieldRole,
			{ key: string; field: FieldDefinition }
		>,
		title: string,
	) {
		if (!typeDef.archive_path_pattern) {
			throw new Error("archive_path_pattern is not defined");
		}
		return typeDef.archive_path_pattern.replace(`{${fields.title.key}}`, title);
	}

	public buildFromDef(typeDef: TypeDefinition) {
		const frontmatter: Record<string, unknown> = {
			type: typeDef.name,
		};
		for (const [k, v] of Object.entries(typeDef.fields ?? {})) {
			if (v.computed) {
				continue;
			}

			if (v.default) {
				frontmatter[k] = v.default;
			}
		}

		return frontmatter;
	}

	public async getConfig(): Promise<Config> {
		const loadResult = await loadConfig(this.root);
		if (!loadResult.config) {
			throw new Error("Error loading base config");
		}

		return loadResult.config;
	}

	public async getType(
		typeName: string,
		preloadedConfig?: Config,
	): Promise<TypeDefinition> {
		const config = preloadedConfig ?? (await this.getConfig());

		if (!config) {
			throw new Error("Error loading base config");
		}

		return getType(this.root, config, typeName);
	}

	static async open(root?: string) {
		if (!root) {
			throw new Error("Missing mdbase collection");
		}

		const collection = await openCollection(root);

		return new Mdbase(root, collection);
	}

	async [Symbol.asyncDispose]() {
		await this.collection.close();
	}
}
