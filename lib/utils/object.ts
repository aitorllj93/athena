/** biome-ignore-all lint/suspicious/noExplicitAny: heavy use of generics */
import { z } from "zod";

export type IsObject<T> = NonNullable<T> extends object ? true : false;

export type DeepKeys<T, Prefix extends string = ""> = {
  [K in keyof T & string]: IsObject<T[K]> extends true
    ? `${Prefix}${K}` | DeepKeys<NonNullable<T[K]>, `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type DeepValue<T, Path extends string> =
  Path extends `${infer Head}.${infer Tail}`
    ? Head extends keyof T
      ? DeepValue<NonNullable<T[Head]>, Tail>
      : never
    : Path extends keyof T
      ? T[Path]
      : never;

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<NonNullable<T[K]>> | undefined }
  : T;

export function getValue<T, P extends DeepKeys<T>>(
  obj: T,
  path: P
): DeepValue<T, P> {
  const keys = (path as string).split(".");
  let result: any = obj;

  for (const key of keys) {
    if (result == null) {
      // stop if there's null or undefined in the chain;
      return undefined as DeepValue<T, P>;
    }
    result = result[key];
  }

  return result as DeepValue<T, P>;
}

export function setValue<T, P extends DeepKeys<T>>(
  obj: T,
  path: P,
  value: DeepValue<T, P>
): T {
  const keys = (path as string).split(".");
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof current;

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (current[key] == null || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key];
    }
  }

  return obj;
}

export function deleteValue<T, P extends DeepKeys<T>>(
  obj: T,
  path: P,
): T {
  const keys = (path as string).split(".");
  let current: any = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof current;

    if (current == null || typeof current !== "object") {
      return obj;
    }

    if (i === keys.length - 1) {
      delete current[key];
    } else {
      current = current[key];
    }
  }

  return obj;
}

export function deepMerge<T extends object>(target: T, source: DeepPartial<T>): T {
  for (const key in source) {
    const sourceVal = source[key];
    const targetVal = target[key as unknown as keyof typeof target];

    if (sourceVal && typeof sourceVal === "object" && !Array.isArray(sourceVal)) {
      if (targetVal == null || typeof targetVal !== "object") {
        (target as any)[key] = {};
      }
      deepMerge((target as any)[key], sourceVal as any);
    } else if (sourceVal !== undefined) {
      (target as any)[key] = sourceVal;
    }
  }
  return target;
}



function unwrapSchema(s: z.ZodType): z.ZodType {
  if (s instanceof z.ZodOptional) return unwrapSchema(s._zod.def.innerType as z.ZodType);
  if (s instanceof z.ZodNullable) return unwrapSchema(s._zod.def.innerType as z.ZodType);
  return s;
}

export function zDeepKeys<T extends z.ZodObject>(schema: T): z.ZodEnum<Record<DeepKeys<z.infer<T>>, DeepKeys<z.infer<T>>>> {
  const keys: string[] = [];

  function collect(s: z.ZodType, prefix = "") {
    const unwrapped = unwrapSchema(s);
  
    if (unwrapped instanceof z.ZodObject) {
      const shape = unwrapped._zod.def.shape;
      for (const key of Object.keys(shape)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        keys.push(fullKey);
        collect(shape[key], fullKey);
      }
    }
  }

  collect(schema);

  if (keys.length === 0) throw new Error("No keys found");
  return z.enum(
    Object.fromEntries(keys.map(k => [k, k])) as Record<
      DeepKeys<z.infer<T>>,
      DeepKeys<z.infer<T>>
    >
  );
}

export function zDeepValue<
  T extends z.ZodObject<any>,
  P extends DeepKeys<z.infer<T>>
>(schema: T, path: P): z.ZodType<DeepValue<z.infer<T>, P>> {
  const keys = (path as string).split(".");

  let current: z.ZodType = schema;

  for (const key of keys) {
    const unwrapped = unwrapSchema(current);

    if (!(unwrapped instanceof z.ZodObject)) {
      throw new Error(`Expected ZodObject at key "${key}", got ${unwrapped.constructor.name}`);
    }

    const shape = unwrapped._zod.def.shape;

    if (!(key in shape)) {
      throw new Error(`Key "${key}" not found in schema`);
    }

    current = shape[key] as z.ZodType;
  }

  return current as z.ZodType<DeepValue<z.infer<T>, P>>;
}

export function zSemanticNumber<T extends z.ZodType>(
  inner: T = z.number() as unknown as T,
) {
  return z.preprocess((v: unknown) => {
    if (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v)) {
      const n = Number(v)
      if (Number.isFinite(n)) return n
    }
    return v
  }, inner)
}

export function zSemanticBoolean<T extends z.ZodType>(
  inner: T = z.number() as unknown as T,
) {
  return z.preprocess(
    (v: unknown) => (v === 'true' ? true : v === 'false' ? false : v),
    inner,
  )
}
