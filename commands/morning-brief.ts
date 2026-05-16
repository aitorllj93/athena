import { getTranslations } from "@/lib/i18n";
import { formatFullDate } from "@/lib/utils/date";
import { getAddressCommand } from "./get-address";
import { getForecastCommand } from "./get-forecast";
import { listUnreadMailsCommand } from "./list-unread-mails";
import { listUpcomingEventsCommand } from "./list-upcoming-events";

const { t } = await getTranslations("morning");

function formatMorningBrief(
	address: string,
	forecast: string,
	events: string,
	mails: string,
) {
	return `# ${t("brief")}

${formatFullDate(new Date().toISOString())}, ${address}
${forecast}

## ${t("agenda")}

${events}

## ${t("inbox")}

${mails}`;
}

export async function morningBriefCommand(): Promise<string> {
	let out = "";

	const [address, forecast, events, mails] = await Promise.all([
		getAddressCommand(),
		getForecastCommand(),
		listUpcomingEventsCommand(),
		listUnreadMailsCommand(),
	]);

	out = formatMorningBrief(address, forecast, events, mails);

	return out;
}
