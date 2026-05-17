import type { FetchMessageObject, ImapFlow } from "imapflow";
import type { DeepKeys } from "@/lib/utils/object";

export type MailClient = ImapFlow;

export type MailMessage = {
  id: number;
  sender: {
    name?: string;
    address: string;
  }
  subject?: string;
  received?: Date;
};
export type MailMessageFields = DeepKeys<MailMessage>;

export function toMailMessage(fetchMessage: FetchMessageObject): MailMessage {
  const subject = fetchMessage.envelope?.subject;

  return {
    id: fetchMessage.uid,
    received: fetchMessage.envelope?.date,
    sender: {
      name: fetchMessage.envelope?.from?.[0]?.name,
      address: fetchMessage.envelope?.from?.[0]?.address ?? ''
    },
    subject,
  }
}
