import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  protectedAdminProcedure,
} from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAdminSecretMessage: protectedAdminProcedure.query(() => {
    return "and you are admin!";
  }),
});
