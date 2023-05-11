import { z } from "zod";

export type OverlayMetadata = z.infer<typeof OverlayMetadata>;
export const OverlayMetadata = z
  .object({
    youtubeId: z.string(),
  })
  .partial();
