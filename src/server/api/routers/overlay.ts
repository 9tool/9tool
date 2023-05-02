import { z } from "zod";

import {
  createTRPCRouter,
  protectedAdminProcedure,
  publicProcedure,
} from "../trpc";

export const overlayRouter = createTRPCRouter({
  getAll: protectedAdminProcedure.query(({ ctx }) => {
    return ctx.prisma.overlay.findMany();
  }),

  getOne: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.overlay.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
    }),

  getOneByKey: publicProcedure
    .input(z.object({ id: z.string(), key: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.overlay.findFirst({
        where: { id: input.id, key: input.key },
        include: { items: true },
      });
    }),

  create: protectedAdminProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["SLIDES", "YOUTUBE_LIVE_CHAT"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlay.create({ data: input });
    }),

  update: protectedAdminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(["SLIDES", "YOUTUBE_LIVE_CHAT"]),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlay.update({
        data: input,
        where: { id: input.id },
      });
    }),

  delete: protectedAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlay.delete({
        where: { id: input.id },
      });
    }),
});
