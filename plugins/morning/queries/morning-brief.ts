import { PluginRegistry } from "@/lib/plugins/registry";
import type { Format } from "@/lib/utils/render";
import { formatMorningBrief } from "../lib/format";

type MorningBriefQueryArgs = {
	format?: Format;
};
export async function morningBriefQuery(
	{ format = "md" }: MorningBriefQueryArgs,
	{ skipCache = true }: { skipCache?: boolean },
): Promise<string> {
	let out = "";

	const [address, forecast, events, mails, tasks] = await Promise.all([
		PluginRegistry.runCommand(
			"map.getAddress",
			{
				format,
			},
			{
				skipCache,
			},
		).catch((err) => {
			return JSON.stringify({ error: err.message });
		}),
		PluginRegistry.runCommand(
			"weather.getForecast",
			{
				format,
			},
			{
				skipCache,
			},
		).catch((err) => {
			return JSON.stringify({ error: err.message });
		}),
		PluginRegistry.runCommand(
			"calendar.listUpcomingEvents",
			{
				fields: ["startTime", "summary", "id"],
				format,
				groupBy: {
					property: "startDate",
				},
			},
			{
				skipCache,
			},
		).catch((err) => {
			return JSON.stringify({ error: err.message });
		}),
		PluginRegistry.runCommand(
			"mail.listUnreadMails",
			{
				format,
			},
			{
				skipCache,
			},
		).catch((err) => {
			return JSON.stringify({ error: err.message });
		}),
		PluginRegistry.runCommand(
			"tasks.listScheduledTasks",
			{
				format,
				groupBy: {
					property: "block",
				},
			},
			{
				skipCache,
			},
		).catch((err) => {
			return JSON.stringify({ error: err.message });
		}),
	]);

	if (format === "json") {
		return JSON.stringify({
			address: JSON.parse(address),
			forecast: JSON.parse(forecast),
			events: JSON.parse(events),
			mails: JSON.parse(mails),
			tasks: JSON.parse(tasks),
		});
	}

	out = await formatMorningBrief(address, forecast, events, mails, tasks);

	return out;
}
