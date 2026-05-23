import { getLogger } from "./logger";

const logger = getLogger("events");

export type EventPayload<T = Record<string, unknown>> = {
  message?: string;
  properties?: T;
};

export function logEvent<T = Record<string, unknown>>(name: string, payload?: EventPayload<T>) {
  logger.info(name, payload);
}
