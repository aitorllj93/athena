import { getTranslations } from "@/lib/i18n";
import { getForecastCommand } from "./get-forecast";
import { listUnreadMailsCommand } from "./list-unread-mails";
import { listUpcomingEventsCommand } from "./list-upcoming-events";


const { t } = await getTranslations("morning");

function formatMorningBrief(
	mails?: string, 
	events?: string,
	forecast?: string,
) {
  return `# ${t("brief")}

${forecast}

## ${t("agenda")}

${events}

## ${t("inbox")}

${mails}`;
}

export async function morningBriefCommand(): Promise<string> {
	let out = "";

	const [mails, events, forecast] = await Promise.all([
		listUnreadMailsCommand(),
		listUpcomingEventsCommand(),
		getForecastCommand(),
	]);

	out = formatMorningBrief(mails, events, forecast);

	return out;
}
