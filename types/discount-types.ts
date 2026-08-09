export type DiscountType = "AMOUNT" | "PERCENTAGE";

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
  id: number;
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

export const MOCK_DISCOUNTS: Discount[] = [
  {
    id: 1,
    name: "50₹ OFF",
    description: "",
    type: "AMOUNT",
    value: "50",
    isActive: true,
    createdAt: "2026-08-09T13:58:54.512Z",
    updatedAt: "2026-08-09T13:58:54.512Z",
  },
  {
    id: 2,
    name: "Weekend 10%",
    description: "Flat 10% off on all weekend orders above ₹500.",
    type: "PERCENTAGE",
    value: "10",
    isActive: true,
    createdAt: "2026-08-05T09:12:00.000Z",
    updatedAt: "2026-08-05T09:12:00.000Z",
  },
  {
    id: 3,
    name: "Happy Hours 100₹",
    description: "Applicable between 4 PM and 6 PM.",
    type: "AMOUNT",
    value: "100",
    isActive: false,
    createdAt: "2026-07-28T11:30:00.000Z",
    updatedAt: "2026-08-01T15:45:00.000Z",
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
let nextId = 4;

/** Mock POST /discount */
export async function apiCreateDiscount(
  body: CreateDiscountRequest,
): Promise<CreateDiscountResponse> {
  await delay(600);
  const now = new Date().toISOString();
  return {
    status: true,
    message: "Discount created successfully.",
    data: {
      id: nextId++,
      name: body.name,
      description: body.description,
      type: body.type,
      value: String(body.value),
      isActive: body.isActive,
      createdAt: now,
      updatedAt: now,
    },
  };
}

/** Mock GET /discount */
export async function apiGetAllDiscounts(): Promise<GetAllDiscountsResponse> {
  await delay(400);
  return {
    status: true,
    message: "Discounts fetched successfully.",
    data: MOCK_DISCOUNTS,
  };
}

/** Mock PATCH /discount/:id (toggle active) */
export async function apiToggleDiscount(id: number, isActive: boolean) {
  await delay(350);
  return {
    status: true,
    message: "Discount updated successfully.",
    id,
    isActive,
  };
}
