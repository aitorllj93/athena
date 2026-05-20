
import { getLogger } from "@/lib/logger";

const logger = getLogger("events");

type ConfirmAssistanceCommandArgs = {
  eventId: string
};
export async function confirmAssistanceCommand(
  { eventId }: ConfirmAssistanceCommandArgs
) {


  logger.info("EventAssistanceConfirmed", { eventId });
}