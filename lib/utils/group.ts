type GroupedResult<K, T> = {
  key: K;
  items: T[];
};

export function groupBy<T, K extends PropertyKey>(
  list: T[],
  getKey: (item: T) => K,
  options?: {
    sortGroups?: (a: K, b: K) => number;
    sortItems?: (a: T, b: T) => number;
  }
): GroupedResult<K, T>[] {
  const map = new Map<K, T[]>();

  for (const item of list) {
    const key = getKey(item);

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key)?.push(item);
  }

  const result = Array.from(map.entries()).map(([key, items]) => ({
    key,
    items: options?.sortItems ? [...items].sort(options.sortItems) : items
  }));

  if (options?.sortGroups) {
    result.sort((a, b) => options.sortGroups ? options.sortGroups(a.key, b.key) : 0);
  }

  return result;
}