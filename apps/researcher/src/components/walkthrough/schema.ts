import yaml from 'yaml';
import {z} from 'zod';

const VideoSchema = z.object({
  title: z.string().min(1),
  active: z.boolean().default(true),
  text: z.string().default(''),
  vimeoId: z.string().regex(/^\d+$/),
  vimeoHash: z.string().optional(),
});

const WalkthroughSchema = z.object({
  videos: z.array(z.unknown()).default([]),
});

export type Video = z.infer<typeof VideoSchema>;

export function parseWalkthrough(
  raw: string,
  {onInvalid}: {onInvalid?: (index: number, issues: unknown) => void} = {}
): Video[] {
  const parsed = WalkthroughSchema.safeParse(yaml.parse(raw));
  if (!parsed.success) {
    onInvalid?.(-1, parsed.error.issues);
    return [];
  }

  return parsed.data.videos.flatMap((entry, index) => {
    const result = VideoSchema.safeParse(entry);
    if (!result.success) {
      onInvalid?.(index, result.error.issues);
      return [];
    }
    if (!result.data.active) return [];
    return [result.data];
  });
}
