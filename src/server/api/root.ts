import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { overlayRouter } from "./routers/overlay";
import { overlayItemRouter } from "./routers/overlayItem";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  overlay: overlayRouter,
  overlayItem: overlayItemRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
