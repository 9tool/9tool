import { z } from "zod";

import { createTRPCRouter, protectedAdminProcedure } from "../trpc";

export const overlayRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) => {
    return ctx.prisma.overlay.findMany();
  }),

  getOne: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.overlay.findUnique({ where: { id: input.id } });
    }),

  create: protectedAdminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlay.create({ data: input });
    }),
});
