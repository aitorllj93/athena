import { logEvent } from "@/lib/events";
import { getTranslations } from "@/lib/i18n";

type ConfirmAssistanceCommandArgs = {
	eventId: string;
};
export async function confirmAssistanceCommand({
	eventId,
}: ConfirmAssistanceCommandArgs) {
  const { t } = await getTranslations("calendar");

	logEvent("EventAssistanceConfirmed", { 
    message: t("events.eventAssistanceConfirmed"),
    properties: {
      eventId
    }
   });
}
