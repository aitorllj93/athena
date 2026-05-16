import { join } from "node:path";

import { CONFIG_DIRECTORY } from "@/lib/constants";

export const USER = process.env.GOOGLE_EMAIL;
export const PORT = 3001;
export const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI ?? `http://localhost:${PORT}/callback`;

export const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const AUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const AUTH_SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/contacts.readonly"
].join(" ");


export const TOKENS_FILE = join(CONFIG_DIRECTORY, ".google_tokens.json");