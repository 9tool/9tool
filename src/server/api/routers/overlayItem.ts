import { z } from "zod";

import { createTRPCRouter, protectedAdminProcedure } from "../trpc";

export const overlayItemRouter = createTRPCRouter({
  // getAll: protectedAdminProcedure.query(({ ctx }) => {
  //   return ctx.prisma.overlayItem.findMany();
  // }),

  // getOne: protectedAdminProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ input, ctx }) => {
  //     return ctx.prisma.overlayItem.findUnique({
  //       where: { id: input.id },
  //       include: { items: true },
  //     });
  //   }),

  create: protectedAdminProcedure
    .input(
      z.object({
        value: z.string(),
        type: z.enum(["TEXT", "IMAGE"]),
        overlayId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlayItem.create({ data: input });
    }),

  update: protectedAdminProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlayItem.update({
        data: input,
        where: { id: input.id },
      });
    }),
});
