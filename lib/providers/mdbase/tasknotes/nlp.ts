import { nanoid } from "nanoid";
import type { NaturalLanguageParserCore as NaturalLanguageParser, ParsedTaskData } from "tasknotes-nlp-core";
import { getLanguage } from "@/lib/i18n";
import type { TaskNotesTask, TaskNotesTaskReminder } from "./types";

let parserInstance: NaturalLanguageParser | null = null;

export function buildParser() {
	const {
		DEFAULT_NLP_TRIGGERS,
		NaturalLanguageParserCore,
	} = require("tasknotes-nlp-core") as typeof import("tasknotes-nlp-core");

	const language = getLanguage();
	const parser = new NaturalLanguageParserCore(
		[],
		[],
		true, // defaultToScheduled
		language, // language code
		DEFAULT_NLP_TRIGGERS, // optional trigger config
	);

	return parser;
}

function getParser() {
	if (!parserInstance) {
		parserInstance = buildParser();
	}
	return parserInstance;
}

function parsedToTaskNotesTask(parsed: ParsedTaskData): TaskNotesTask {
	const reminders: TaskNotesTaskReminder[] = [];

	if (parsed.scheduledTime) {
		reminders.push({
			id: nanoid(),
			type: "absolute",
			relatedTo: "scheduled",
			absoluteTime: `${parsed.scheduledDate}T${parsed.scheduledTime}:00`,
		});
	}

	if (parsed.dueTime) {
		reminders.push({
			id: nanoid(),
			type: "absolute",
			relatedTo: "due",
			absoluteTime: `${parsed.dueDate}T${parsed.dueTime}:00`,
		});
	}

	return {
		title: parsed.title,
		due: parsed.dueDate,
		scheduled: parsed.scheduledDate,
		priority: parsed.priority,
		reminders,
		status: parsed.status,
		tags: parsed.tags,
		contexts: parsed.contexts,
		projects: parsed.projects,
		recurrence: parsed.recurrence,
		timeEstimate: parsed.estimate,
	};
}

export function parse(value: string): TaskNotesTask {
	const parsed = getParser().parseInput(value);

	return parsedToTaskNotesTask(parsed);
}
