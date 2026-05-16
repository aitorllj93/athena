import { getAddressCommand } from "@/commands/get-address";
import { procedure, router } from "@/lib/trpc";

const map = router({
  address: procedure.query(async () => {
    return getAddressCommand();
  }),
});

export default map;
