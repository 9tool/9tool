import { PrismaClient } from "@prisma/client";
import type { OverlayPayload } from "@prisma/client";
import type * as runtime from "@prisma/client/runtime/index";

import { env } from "../env/server.mjs";
import { OverlayMetadata } from "../utils/zod-schema";

declare global {
  // eslint-disable-next-line no-var
  var prisma: typeof prismaWithClientExt;
}

const prismaWithClientExt = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
}).$extends({
  result: {
    overlay: {
      metadata: {
        needs: { metadata: true },
        compute({ metadata }) {
          return OverlayMetadata.parse(metadata);
        },
      },
    },
  },
  query: {
    overlay: {
      create({ args, query }) {
        args.data.metadata = OverlayMetadata.parse(args.data.metadata);
        return query(args);
      },
      createMany({ args, query }) {
        const overlays = Array.isArray(args.data) ? args.data : [args.data];
        for (const overlay of overlays) {
          overlay.metadata = OverlayMetadata.parse(overlay.metadata);
        }
        return query(args);
      },
      update({ args, query }) {
        if (args.data.metadata !== undefined) {
          args.data.metadata = OverlayMetadata.parse(args.data.metadata);
        }
        return query(args);
      },
      updateMany({ args, query }) {
        if (args.data.metadata !== undefined) {
          args.data.metadata = OverlayMetadata.parse(args.data.metadata);
        }
        return query(args);
      },
      upsert({ args, query }) {
        args.create.metadata = OverlayMetadata.parse(args.create.metadata);
        if (args.update.metadata !== undefined) {
          args.update.metadata = OverlayMetadata.parse(args.update.metadata);
        }
        return query(args);
      },
    },
  },
});

export const prisma = global.prisma || prismaWithClientExt;

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export type Overlay = runtime.Types.GetResult<
  OverlayPayload<(typeof prismaWithClientExt)["$extends"]["extArgs"]>,
  unknown,
  "findUniqueOrThrow"
>;

export * from "@prisma/client";
