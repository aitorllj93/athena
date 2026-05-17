import { getTranslations } from "@/lib/i18n";
import { PluginRegistry } from "@/lib/plugins/registry";
import { formatFullDate } from "@/lib/utils/date";
import type { Format } from "@/lib/utils/render";

// biome-ignore lint/suspicious/noExplicitAny: i18n translation function type
let translator: any = null;
async function getT() {
	if (translator) return translator;
	const { t } = await getTranslations("morning");
	translator = t;
	return t;
}

async function formatMorningBrief(
	address: string,
	forecast: string,
	events: string,
	mails: string,
	tasks: string,
) {
	const t = await getT();
	return `# ${t("brief")}

${formatFullDate(new Date().toISOString())}, ${address}
${forecast}

## ${t("agenda")}

${events}

## ${t("scheduled")}

${tasks}

## ${t("inbox")}

${mails}`;
}

export async function morningBriefCommand(
	fields?: string[],
	format?: Format,
): Promise<string> {
	let out = "";

	// Fetch information dynamically from other registered plugins via the Registry!
	const [address, forecast, events, mails, tasks] = await Promise.all([
		PluginRegistry.runCommand("map.getAddress").catch(
			() => "Map plugin not installed",
		),
		PluginRegistry.runCommand("weather.getForecast").catch(
			() => "Weather plugin not installed",
		),
		PluginRegistry.runCommand("calendar.listUpcomingEvents", {
			fields: ["startTime", "summary", "id"],
			groupBy: {
				property: "startDate"
			}
		}).catch(
			() => "Calendar plugin not installed",
		),
		PluginRegistry.runCommand("mail.listUnreadMails").catch(
			() => "Mail plugin not installed",
		),
		PluginRegistry.runCommand("tasks.listScheduledTasks", {
			groupBy: {
				property: "block"
			} 
		}).catch(
			() => "Tasks plugin not installed",
		),
	]);

	out = await formatMorningBrief(address, forecast, events, mails, tasks);

	return out;
}
