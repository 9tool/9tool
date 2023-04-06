import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ path, error }) => {
    if (env.NODE_ENV === "development") {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.error(`❌ tRPC failed on ${path}`);
    }
    console.error(error);
  },
});
