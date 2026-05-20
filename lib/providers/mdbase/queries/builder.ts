import { intersection, type QueryExpression } from "./utils";

type ExpressionBuilderFn<
  TObject,
  TKey extends keyof TObject,
  TContext = unknown,
> = (v: NonNullable<TObject[TKey]>, context: TContext) => QueryExpression | QueryExpression[] | undefined;

export type FilterEntry<
  TObject,
  TKey extends keyof TObject,
  TContext = unknown,
> = {
  key: TKey;
  build: ExpressionBuilderFn<TObject, TKey, TContext>;
};

export type FilterMap<TObject = unknown, TContext = unknown> = {
  [K in keyof TObject]: FilterEntry<TObject, K, TContext>;
};

type BuildQueryArgs<TObject extends Record<string, unknown>, TContext = unknown> = {
  filters: TObject | TObject[];
  builders: Map<keyof TObject, FilterMap<TObject, TContext>[keyof TObject]>;
  context?: TContext;
};

export function buildQuery<TObject extends Record<string, unknown>, TContext = unknown>({
  filters,
  builders,
  context,
}: BuildQueryArgs<TObject, TContext>): QueryExpression {
  const filterGroups = Array.isArray(filters) ? filters : [filters];

  const expressions: QueryExpression[] = [];

  for (const group of filterGroups) {
    for (const [k, v] of Object.entries(group)) {
      if (typeof v === "undefined") {
        continue;
      }

      if (!builders.has(k)) {
        console.warn(`Builder for filter "${k}" not found`);
        continue;
      }

      const builder = builders.get(k) as unknown as FilterEntry<TObject, keyof TObject>;

      const expression = builder.build(v as NonNullable<TObject[keyof TObject]>, context);

      if (expression) {
        expressions.push(
          ...(Array.isArray(expression)
            ? expression
            : [expression]
          ),
        );
      }
    }
  }

  return intersection(expressions);
}