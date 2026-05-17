import z from "zod";

export const fields = z.string().transform((value) =>
  value.split(",").map((item) => item.trim())
).optional();

export const format = z.enum([
  "csv",
  "json",
  "md",
  "mdcheck",
  "mdlist",
  "mdtable",
  "text",
]).default("text");

export const limit = z.int();
export const page = z.int().default(1);

export const groupBy = z.string();
export const groupByDirection = z.enum([
  "desc",
  "asc"
]).optional().default("desc")

export default {
  fields,
  format,
  groupBy,
  groupByDirection,
  limit,
  page,
}