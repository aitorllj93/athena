import { getTranslations } from "@/lib/i18n";
import { formatFullDate } from "@/lib/utils/date";

export async function formatMorningBrief(
  address: string,
  forecast: string,
  events: string,
  mails: string,
  tasks: string,
) {
  const { t } = await getTranslations("morning");
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