import { ImapFlow, type ImapFlowOptions } from "imapflow";

import { getLogger } from "@/lib/logger";

import type { MailClient } from "./types";

const logger = getLogger("imap");

export function createClient(auth: ImapFlowOptions["auth"]): MailClient {
	if (!auth) {
		throw new Error("Could not initialise mailClient");
	}

	const client = new ImapFlow({
		host: "imap.gmail.com",
		port: 993,
		secure: true,
		logger,
		auth,
	});

	return client;
}
