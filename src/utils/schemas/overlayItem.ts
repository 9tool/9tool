import { z } from "zod";

export const overlayItemCreateSchema = z.object({
  type: z.enum(["TEXT", "IMAGE"]),
  value: z.string(),
});
