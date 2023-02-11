import { z } from "zod";

import { createTRPCRouter, protectedAdminProcedure } from "../trpc";

export const overlayRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) => {
    return ctx.prisma.overlay.findMany();
  }),
});
