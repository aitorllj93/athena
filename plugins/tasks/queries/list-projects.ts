import ms from "ms";

import { memo } from "@/lib/cache";
import { Mdbase } from "@/lib/providers/mdbase";
import type { GroupByParams } from "@/lib/utils/group";
import type { PaginationParams } from "@/lib/utils/pagination";
import type { Format } from "@/lib/utils/render";

import {
	formatProjects,
	formatProjectsGroups,
	MDBASE_COLLECTION_ROOT,
} from "../lib";
import { listProjects, type ProjectFields } from "../lib/projects";

const CACHE_TTL = ms("2h");
const CACHE_KEY = "listProjectsQuery";

type ListProjectsQueryArgs = {
	fields?: ProjectFields[];
	format?: Format;
	groupBy?: GroupByParams;
	pagination?: PaginationParams;
};
export const listProjectsQuery = memo(
	async function listProjectsQuery({
		fields = ["id", "name", "path"],
		format = "md",
		groupBy,
		pagination,
	}: ListProjectsQueryArgs = {}): Promise<string> {
		let out = "";

		await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

		const { data, groups } = await listProjects(db, {
			groupBy,
			pagination,
		});

		if (groups) {
			out += await formatProjectsGroups(groups, format, fields);
		} else if (data) {
			out += await formatProjects(data, format, fields);
		}

		return out;
	},
	CACHE_TTL,
	CACHE_KEY,
);
