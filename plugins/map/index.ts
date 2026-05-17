import { getAddressCommand } from "./commands/get-address";
import router from "./router";

export default {
	name: "map",
	router,
	commands: {
		getAddress: getAddressCommand,
	},
};
