import z from "zod";

export const fields = z.string().transform((value) =>
  value.split(",").map((item) => item.trim())
).optional().describe("Fields to display. Comma separated values");

export const format = z.enum([
  "csv",
  "json",
  "md",
  "mdcheck",
  "mdlist",
  "mdlist2",
  "mdtable",
  "text",
]).default("text");

export const limit = z.int().min(0).max(999);
export const page = z.int().default(1);

export const groupBy = z.string().describe("Field to use for the grouping");
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