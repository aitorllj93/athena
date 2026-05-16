import type { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import type { CalendarClient } from "./types";

export function createClient(auth: OAuth2Client): CalendarClient {
	if (!auth) {
		throw new Error("Could not initialise calendarClient");
	}

	const client = google.calendar({
		version: "v3",
		auth,
	});

	return client;
}
