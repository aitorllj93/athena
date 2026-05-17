import { getTranslations } from "@/lib/i18n";
import { formatFullDate } from "@/lib/utils/date";
import type { Format } from "@/lib/utils/render";

import { getAddressCommand } from "./get-address";
import { getForecastCommand } from "./get-forecast";
import { listScheduledTasksCommand } from "./list-scheduled-tasks";
import { listUnreadMailsCommand } from "./list-unread-mails";
import { listUpcomingEventsCommand } from "./list-upcoming-events";

const { t } = await getTranslations("morning");

function formatMorningBrief(
	address: string,
	forecast: string,
	events: string,
	mails: string,
	tasks: string,
) {
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

	const [address, forecast, events, mails, tasks] = await Promise.all([
		getAddressCommand(),
		getForecastCommand(),
		listUpcomingEventsCommand(),
		listUnreadMailsCommand(),
		listScheduledTasksCommand(),
	]);

	out = formatMorningBrief(address, forecast, events, mails, tasks);

	return out;
}
