import ms from "ms";
import { memo } from "@/lib/cache";
import { getAccessToken, getUser } from "@/lib/providers/google/auth";
import { createClient } from "../lib/client";
import { INBOX } from "../lib/constants";
import { spamMail } from "../lib/spam-mail";

const CACHE_TTL = ms("1s");
const CACHE_KEY = "spamMailCommand";

type SpamMailCommandArgs = {
  id: string;
};
export const spamMailCommand = memo(
  async function deleteMailCommand({
    id,
  }: SpamMailCommandArgs): Promise<string> {
    const out = "";

    const accessToken = getAccessToken();
    const user = getUser();

    const mailClient = createClient({
      user,
      accessToken,
    });

    await mailClient.connect();

    const lock = await mailClient.getMailboxLock(INBOX);

    try {
      await spamMail(mailClient, { id });
    } finally {
      lock.release();
    }

    await mailClient.logout();

    return out;
  },
  CACHE_TTL,
  CACHE_KEY,
);
