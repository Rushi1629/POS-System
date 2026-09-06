export type DiscountType = "AMOUNT" | "PERCENTAGE";
export type DiscountStatus = "all" | "active" | "inactive";

export interface FetchDiscountsParams {
  page: number;
  limit: number;
  search?: string;
  status?: DiscountStatus;
}

/** POST /discount — request body */
export interface CreateDiscountRequest {
  name: string;
  description: string;
  type: DiscountType;
  value: number;
  isActive: boolean;
}

/** Shared discount record shape returned by the API */
export interface Discount {
  id: string;
  name: string;
  description: string;
  type: DiscountType;
  /** API returns the numeric value as a string */
  value: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** GET /discount — response */
export interface GetAllDiscountsResponse {
  status: boolean;
  message: string;
  data: Discount[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** POST /discount — response */
export interface CreateDiscountResponse {
  status: boolean;
  message: string;
  data: Discount;
}

/** PATCH /discount/:id — request body */
export type UpdateDiscountRequest = Partial<CreateDiscountRequest>;

export function formatDiscountValue(d: Pick<Discount, "type" | "value">) {
  const n = Number(d.value);
  return d.type === "PERCENTAGE" ? `${n}%` : `₹${n.toLocaleString("en-IN")}`;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
let nextId = 4;

