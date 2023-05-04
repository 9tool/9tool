import { z } from "zod";

import {
  createTRPCRouter,
  protectedAdminProcedure,
  publicProcedure,
} from "../trpc";
import { overlayCreateSchema } from "~/utils/schemas/overlay";
import type { Prisma } from "@prisma/client";

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
    .input(overlayCreateSchema)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlay.create({
        data: {
          ...input,
          metadata: JSON.parse(input.metadata) as Prisma.JsonObject,
        },
      });
    }),

  update: protectedAdminProcedure
    .input(
      overlayCreateSchema.merge(
        z.object({
          id: z.string(),
        })
      )
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.overlay.update({
        data: {
          ...input,
          metadata: JSON.parse(input.metadata) as Prisma.JsonObject,
        },
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
