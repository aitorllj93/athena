import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Collection, type MdbaseConfig } from "@callumalpass/mdbase";
import matter from "gray-matter";
import type { TypeDefinition } from "./types";


export async function openCollection(
  collectionRoot: string,
) {
  const opened = await Collection.open(collectionRoot);

  if (!opened.collection) {
    throw new Error(`Error opening collection: ${opened.error?.message}`);
  }

  return opened.collection;
}

/**
 * We cannot use the mdbase `getType` utility because we need a custom field for the archive path.
 */
export async function getType(
  collectionRoot: string,
  config: MdbaseConfig,
  typeName: string,
) {
  const typeRaw = await readFile(
    join(collectionRoot, config.settings.types_folder, `${typeName}.md`),
    "utf-8",
  );
  const parsed = matter(typeRaw);
  const typeDef = parsed.data as TypeDefinition;

  return typeDef;
}
