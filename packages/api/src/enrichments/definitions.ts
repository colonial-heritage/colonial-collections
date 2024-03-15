import {localeSchema, Thing} from '../definitions';
import {z} from 'zod';

export const searchOptionsSchema = z.object({
  locale: localeSchema,
  query: z.string(),
  limit: z.number().int().positive().optional().default(10),
});

export type SearchOptions = z.input<typeof searchOptionsSchema>;

export type SearchResult = {
  things: Thing[];
};
