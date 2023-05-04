import { z } from "zod";

export const overlayCreateSchema = z.object({
  name: z.string().min(3).max(20),
  // type: OverlayTypeSchema, // FIXME
  type: z.enum(["SLIDES", "YOUTUBE_LIVE_CHAT"]),
  // metadata: z.record(z.string().min(1), z.union([z.string(), z.number()])),
  metadata: z.string(),
});
