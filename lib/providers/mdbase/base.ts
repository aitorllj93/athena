import {
  loadConfig,
} from "@callumalpass/mdbase";

import type { Collection, Config, TypeDefinition } from "./types";
import { getType, openCollection } from "./utils";

export class Mdbase {
  private constructor(
    public readonly root: string,
    public collection: NonNullable<
      Collection
    >,
  ) {}

  public resolvePath(
    typeDef: TypeDefinition, 
    title: string,
  ) {
    if (!typeDef.path_pattern) {
      throw new Error("path_pattern is not defined");
    }
    return typeDef.path_pattern.replace("{title}", title);
  }

  public resolveArchivePath(
    typeDef: TypeDefinition, 
    title: string,
  ) {
    if (!typeDef.archive_path_pattern) {
      throw new Error("archive_path_pattern is not defined");
    }
    return typeDef.archive_path_pattern.replace("{title}", title);
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

    const collection = await openCollection(root)

    return new Mdbase(root, collection);
  }

  async [Symbol.asyncDispose]() {
    await this.collection.close();
  }
}
