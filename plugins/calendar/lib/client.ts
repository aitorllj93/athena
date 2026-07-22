import type { OAuth2Client } from "google-auth-library";
import type { calendar_v3 } from "googleapis";
import { google } from "googleapis";

export type CalendarClient = calendar_v3.Calendar;

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
