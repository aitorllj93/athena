
import { orderBy as naturalOrderby } from 'natural-orderby';
import { type DeepKeys, getValue } from './object';

export type OrderFields<T> = {
    key: DeepKeys<T>,
    order: "asc" | "desc"
  }[]

export function orderBy<T = unknown>(
  items: T[],
  fields: OrderFields<T>
): T[] {
  if (fields.length === 0) {
    return items;
  }

  return naturalOrderby(
    items,
    fields.map((f) => (v: T) => getValue(v, f.key)),
    fields.map(f => f.order)
  );
}