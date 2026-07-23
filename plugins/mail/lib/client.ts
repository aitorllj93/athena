import { ImapFlow, type ImapFlowOptions, type MailboxLockObject } from "imapflow";

import { getLogger } from "@/lib/logger";

export type MailClient = ImapFlow;

const logger = getLogger("imap");

export class ImapClient {
	
	private lockObject?: MailboxLockObject;

	private constructor(
		public readonly client: ImapFlow,
	) {}
	
	static async open(auth?: ImapFlowOptions["auth"]) {
		if (!auth) {
			throw new Error("Missing Imap auth credentials");
		}

		const client = new ImapFlow({
			host: "imap.gmail.com",
			port: 993,
			secure: true,
			logger,
			auth,
		});

		await client.connect();

		client.on("error", (error) => {
			console.log("error", error)
		});

		return new ImapClient(client);
	}

	public async lock(box: string) {
		this.lockObject = await this.client.getMailboxLock(box);
	}

	public unlock() {
		this.lockObject?.release();
		delete this.lockObject;
	}

	async [Symbol.asyncDispose]() {
		this.unlock();
		await this.client.logout();
		this.client.close();
	}
}