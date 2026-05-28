import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";
import { Mdbase } from "@/lib/providers/mdbase";
import { MDBASE_COLLECTION_ROOT } from "../lib";
import { trackTask } from "../lib/track-task";

type TrackTaskCommandArgs = {
	name: string;
	description?: string;
	startTime?: string;
	endTime?: string;
};
export async function trackTaskCommand(
	args: TrackTaskCommandArgs,
): Promise<string> {
	const { t } = await getTranslations("tasks");
	const out = "";

	await using db = await Mdbase.open(MDBASE_COLLECTION_ROOT);

	const time = await trackTask(db, args);

	logEvent("TaskTimeTracked", {
		message: t("events.taskTimeTracked"),
		properties: time,
	});

	return out;
}
