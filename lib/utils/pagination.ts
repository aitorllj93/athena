export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export function paginate<T = unknown>(
  items: T[],
  params: PaginationParams = {},
): {
  data: T[];
  page: Pagination;
} {
  const page = params.page ?? 1;
  const limit = params.limit ?? items.length;
  const offset = (page - 1) * limit;

  const total = items.length;
  const data = items.slice(offset, offset + limit);

  return {
    data,
    page: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: offset + limit < total,
    },
  };
}