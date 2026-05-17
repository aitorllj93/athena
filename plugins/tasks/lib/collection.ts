import { Collection } from "@callumalpass/mdbase";

import { MDBASE_COLLECTION_ROOT } from "./constants";

export class DisposableCollection {
  private constructor(
    public collection: NonNullable<
      Awaited<ReturnType<typeof Collection.open>>["collection"]
    >
  ) {}

  static async open(root = MDBASE_COLLECTION_ROOT) {
    if (!root) {
      throw new Error("Missing mdbase collection");
    }

    const opened = await Collection.open(root);

    if (opened.error) {
      throw new Error(opened.error.message);
    }

    return new DisposableCollection(opened.collection!);
  }

  async [Symbol.asyncDispose]() {
    await this.collection.close();
  }
}