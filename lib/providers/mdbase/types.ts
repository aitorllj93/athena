import type { Collection as MdbaseCollection, MdbaseConfig, TypeDefinition as MdbaseTypeDefinition } from "@callumalpass/mdbase";


export type Config = MdbaseConfig;

export type Collection = MdbaseCollection;

/**
 * We cannot use the mdbase `TypeDefinition` because we need a custom field for the archive path.
 */
export type TypeDefinition = MdbaseTypeDefinition & {
  archive_path_pattern?: string;
};