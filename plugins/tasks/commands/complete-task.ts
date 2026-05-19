import { completeTask } from "../lib";

type CompleteTaskCommandArgs = {
	name: string;
};
export async function completeTaskCommand({
	name,
}: CompleteTaskCommandArgs): Promise<string> {
	const out = "";

	await completeTask({ name });

	return out;
}
