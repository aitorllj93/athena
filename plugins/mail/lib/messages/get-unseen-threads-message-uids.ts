import type { MailClient } from "../client";

/**
 * This method retrieves the unseen uids discriminated by threadId to avoid on UI views.
 */
export async function getUnseenThreadsMessageUids(client: MailClient): Promise<number[]> {

  const unseenUids = await client.search({ seen: false }, { uid: true });

  if (!unseenUids || unseenUids.length === 0) {
    return [];
  }

  // we fetch the threadId and internalData for each message
  const threadInfo = unseenUids ? await client.fetchAll(
    unseenUids,
    {
      internalDate: true,
      threadId: true,
    },
    { uid: true }
  ) : [];

  const latestByThread = new Map<
    string,
    {
      uid: number;
      internalDate: Date;
    }
  >();

	for (const message of threadInfo) {
		const key = message.threadId ?? String(message.uid);

		const current = latestByThread.get(key);

		const date =
			message.internalDate instanceof Date
				? message.internalDate
				: new Date(message.internalDate as string);

		if (!current || date > current.internalDate) {
			latestByThread.set(key, {
				uid: message.uid,
				internalDate: date,
			});
		}
	}

	const representativeUids = [...latestByThread.values()]
		.sort(
			(a, b) =>
				b.internalDate.getTime() - a.internalDate.getTime(),
		)
		.map((x) => x.uid);

  return representativeUids;
}