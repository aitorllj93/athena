
export const INBOX = "INBOX";

export const ALL_SPECIAL_USE_FLAG = "\\All";
export const TRASH_SPECIAL_USE_FLAG = "\\Trash";
export const SPAM_SPECIAL_USE_FLAG = "\\Junk";
export const SENT_SPECIAL_USE_FLAG = "\\Sent";
export const FEATURED_SPECIAL_USE_FLAG = "\\Flagged";
export const DRAFTS_SPECIAL_USE_FLAG = "\\Drafts";
export const INBOX_SPECIAL_USE_FLAG = "\\Inbox";

export type SpecialUseFlag = |
  typeof ALL_SPECIAL_USE_FLAG |
  typeof TRASH_SPECIAL_USE_FLAG |
  typeof SPAM_SPECIAL_USE_FLAG |
  typeof SENT_SPECIAL_USE_FLAG |
  typeof FEATURED_SPECIAL_USE_FLAG |
  typeof DRAFTS_SPECIAL_USE_FLAG |
  typeof INBOX_SPECIAL_USE_FLAG;

export const SPECIAL_USE_EMOJIS: Record<SpecialUseFlag, string> = {
  "\\All": "📬",
  "\\Drafts": "📝",
  "\\Flagged": "🚩",
  "\\Inbox": "📥",
  "\\Junk": "📛",
  "\\Sent": "📤",
  "\\Trash": "🗑️"
}

export const SEEN_MESSAGE_FLAG = "\\Seen";