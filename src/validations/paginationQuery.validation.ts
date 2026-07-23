import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.string().optional(),

  limit: z.string().optional(),

  searchTerm: z.string().optional(),

  sortBy: z.string().optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),
});