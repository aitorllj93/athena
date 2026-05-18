

import type { Format, RenderFn } from "../types";
import { renderMdCheckList } from "./checklist";
import { renderCsv } from "./csv";
import { renderJson } from "./json";
import { renderMdList } from "./list";
import { renderMdListOneline } from "./list-oneline";
import { renderMdTable } from "./table";
import { renderText } from "./text";

export * from "./checklist";
export * from "./csv";
export * from "./json";
export * from "./list";
export * from "./table";
export * from "./text";

export const RENDERERS: Record<Format, RenderFn> = {
  csv: renderCsv,
  json: renderJson,
  md: renderMdTable,
  mdtable: renderMdTable,
  mdlist: renderMdList,
  mdlist2: renderMdListOneline,
  mdcheck: renderMdCheckList,
  text: renderText,
};