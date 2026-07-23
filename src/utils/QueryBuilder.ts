import { Query, QueryFilter} from "mongoose";

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;

  public query: Record<string, unknown>;

  private filterQuery: QueryFilter<T> = {};

  private page = 1;

  private limit = 10;

  private readonly excludedFields = [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "searchTerm",
  ] as const;

  constructor(
    modelQuery: Query<T[], T>,
    query: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;

    this.query = query;
  }

  search(searchableFields: ReadonlyArray<string>) {
    const searchTerm =
      typeof this.query.searchTerm === "string"
        ? this.query.searchTerm.trim()
        : "";

    if (typeof searchTerm === "string" && searchTerm.trim()) {
      this.filterQuery.$or = searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      }));
    }

    return this;
  }

  filter() {
    const query = { ...this.query };

    this.excludedFields.forEach((field) => delete query[field]);

    this.filterQuery = {
      ...this.filterQuery,
      ...query,
    };

    this.modelQuery = this.modelQuery.find(this.filterQuery);

    return this;
  }

  sort(defaultSort = "-createdAt") {
    const sortBy = this.query.sortBy as string;

    const sortOrder = this.query.sortOrder as string;

    if (sortBy) {
      this.modelQuery = this.modelQuery.sort({
        [sortBy]: sortOrder === "asc" ? 1 : -1,
      });
    } else {
      this.modelQuery = this.modelQuery.sort(defaultSort);
    }

    return this;
  }

  paginate() {
    this.page = Math.max(Number(this.query.page) || 1, 1);

    this.limit = Math.max(
      Math.min(Number(this.query.limit) || 10, 100),
      1,
    );

    const skip = (this.page - 1) * this.limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(this.limit);

    return this;
  }

  async countTotal(): Promise<TMeta> {
    const total = await this.modelQuery.model.countDocuments(
      this.filterQuery,
    );

    return {
      page: this.page,
      limit: this.limit,
      total,
      totalPage: Math.ceil(total / this.limit),
    };
  }
}
