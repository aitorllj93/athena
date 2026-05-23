import ms from "ms";

import { memo } from "@/lib/cache";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";

import type { GroupByParams } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";

import {
  formatTasks,
  formatTasksGroups,
  listProjectTasks,
  MDBASE_COLLECTION_ROOT,
  type TaskFields,
} from "../lib";

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listProjectTasksQuery";

type ListProjectTasksQueryArgs = {
  projectName: string;
  fields?: TaskFields[];
  format?: Format;
  groupBy?: GroupByParams;
  pagination?: PaginationParams;
};
export const listProjectTasksQuery = memo(
  async function listProjectTasksQuery({
    projectName,
    fields = ["name", "timeEstimate", "priority"],
    format = "md",
    groupBy,
    pagination,
  }: ListProjectTasksQueryArgs): Promise<string> {
    let out = "";

    await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);
    const { t } = await getTranslations("tasks");

    const { data, groups, page } = await listProjectTasks(db, {
      projectName,
      pagination,
      groupBy,
    });

    out += `${t("messages.unreadCount", { total: page.total })}\n\n`;

    if (groups) {
      out += await formatTasksGroups(groups, format, fields);
    } else if (data) {
      out += await formatTasks(data, format, fields);
    }

    return out;
  },
  CACHE_TTL,
  CACHE_KEY,
);
