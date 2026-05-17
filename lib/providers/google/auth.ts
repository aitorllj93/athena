import { rm } from "node:fs/promises";
import type { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import ms from "ms";
import { getTranslations } from "@/lib/i18n";
import {
	AUTH_SCOPES,
	AUTH_TOKEN_URL,
	AUTH_URL,
	CLIENT_ID,
	CLIENT_SECRET,
	PORT,
	REDIRECT_URI,
	TOKENS_FILE,
	USER,
} from "./constants";

type GoogleTokens = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: "Bearer";
	refresh_token_expires_in: number;
	received_at: number;
	refresh_token_received_at: number;
};

type GoogleAuthError = {
	error: "invalid_grant";
	error_description: "Bad Request";
};

const { t } = await getTranslations("auth");

// Shared state container on globalThis to support compiled binaries
const state = {
	get tokens(): GoogleTokens | null {
		// biome-ignore lint/suspicious/noExplicitAny: access globalThis property
		return (globalThis as any).__athena_google_tokens__ || null;
	},
	set tokens(val: GoogleTokens | null) {
		// biome-ignore lint/suspicious/noExplicitAny: write globalThis property
		(globalThis as any).__athena_google_tokens__ = val;
	}
};

function getCredentials(): { client_id: string; client_secret: string } {
	if (!CLIENT_ID) {
		throw new Error(`Missing env var "CLIENT_ID"`);
	}
	if (!CLIENT_SECRET) {
		throw new Error(`Missing env var "CLIENT_SECRET"`);
	}

	return {
		client_id: CLIENT_ID,
		client_secret: CLIENT_SECRET,
	};
}

function isTokenExpiringSoon(thresholdMs = ms("30m")) {
	if (!state.tokens) {
		throw new Error("Undefined tokens");
	}

	const expiresAt = state.tokens.received_at + state.tokens.expires_in * 1000;

	const timeLeftMs = expiresAt - Date.now();

	return timeLeftMs < thresholdMs;
}
function isRefreshTokenExpiringSoon(thresholdMs = ms("1h")) {
	if (!state.tokens) {
		throw new Error("Undefined tokens");
	}

	const expiresAt = state.tokens.received_at + state.tokens.expires_in * 1000;

	const timeLeftMs = expiresAt - Date.now();

	return timeLeftMs < thresholdMs;
}

function buildAuthUrl() {
	const credentials = getCredentials();
	const url = new URL(AUTH_URL);
	url.searchParams.set("client_id", credentials.client_id);
	url.searchParams.set("redirect_uri", REDIRECT_URI);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("scope", AUTH_SCOPES);
	url.searchParams.set("access_type", "offline");
	url.searchParams.set("prompt", "consent");
	return url.toString();
}

async function waitForCode(): Promise<string> {
	console.log(t("waitingOauthCallback", { callbackUrl: REDIRECT_URI }));

	return new Promise((resolve) => {
		let server: Bun.Server<undefined>;

		server = Bun.serve({
			port: PORT,
			fetch(req) {
				const url = new URL(req.url);
				const code = url.searchParams.get("code");

				if (url.pathname === "/callback" && code) {
					resolve(code);
					const response = new Response(t("callbackResponse"));

					queueMicrotask(() => {
						server.stop();
					});

					return response;
				}

				return new Response("Not found", { status: 404 });
			},
		});
	});
}

async function exchangeCode(code: string): Promise<GoogleTokens> {
	const credentials = getCredentials();

	const res = await fetch(AUTH_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: credentials.client_id,
			client_secret: credentials.client_secret,
			code,
			grant_type: "authorization_code",
			redirect_uri: REDIRECT_URI,
		}),
	});

	const resTokens = (await res.json()) as GoogleTokens;

	if (resTokens.expires_in) {
		resTokens.received_at = Date.now();
	}
	if (resTokens.refresh_token_expires_in) {
		resTokens.refresh_token_received_at = Date.now();
	}

	return resTokens;
}

async function saveTokens(tokens: GoogleTokens) {
	await Bun.write(TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

async function loadTokens(): Promise<GoogleTokens | null> {
	try {
		const raw = await Bun.file(TOKENS_FILE).text();
		const tokens = JSON.parse(raw) as GoogleTokens;

		return tokens;
	} catch {
		return null;
	}
}

export async function refreshAccessToken(
	refresh_token: string,
): Promise<GoogleTokens | GoogleAuthError> {
	const credentials = getCredentials();

	const res = await fetch(AUTH_TOKEN_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: credentials.client_id,
			client_secret: credentials.client_secret,
			refresh_token,
			grant_type: "refresh_token",
		}),
	});

	const resTokens = (await res.json()) as GoogleTokens;

	if (resTokens.expires_in) {
		resTokens.received_at = Date.now();
	}
	if (resTokens.refresh_token_expires_in) {
		resTokens.refresh_token_received_at = Date.now();
	}

	return resTokens;
}

export async function auth() {
	state.tokens = await loadTokens();

	if (state.tokens) {
		if (isTokenExpiringSoon()) {
			const newTokens = await refreshAccessToken(state.tokens.refresh_token);
			if ("error" in newTokens) {
				await rm(TOKENS_FILE);
				throw new Error(newTokens.error_description);
			}
			Object.assign(state.tokens, newTokens);
			await saveTokens(state.tokens);
		}
		return state.tokens;
	}

	const authUrl = buildAuthUrl();

	console.log(t("openLinkInBrowser", { url: authUrl }));

	const code = await waitForCode();

	state.tokens = await exchangeCode(code);

	if (state.tokens) {
		await saveTokens(state.tokens);
		console.log(t("savedTokens", { tokensPath: TOKENS_FILE }));
	}
}

export function getUser() {
	if (!USER) {
		throw new Error(`Missing env var "GOOGLE_EMAIL"`);
	}

	return USER;
}

export function getAccessToken() {
	if (!state.tokens) {
		throw new Error("Unauthorized. Run auth() first.");
	}

	return state.tokens.access_token;
}

export function getOAuthClient(): OAuth2Client {
	if (!state.tokens) {
		throw new Error("Unauthorized. Run auth() first.");
	}

	const credentials = getCredentials();
	const client = new google.auth.OAuth2(
		credentials.client_id,
		credentials.client_secret,
		REDIRECT_URI,
	);

	client.setCredentials({
		access_token: state.tokens.access_token,
	});

	return client;
}
