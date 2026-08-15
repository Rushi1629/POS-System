/** POST /inventory — request body */
export interface CreateInventoryRequest {
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  isActive: boolean;
}

/** PATCH /inventory/:id — request body */
export type UpdateInventoryRequest = Partial<CreateInventoryRequest>;

/** Shared inventory record shape returned by the API */
export interface InventoryItem {
  inventoryId: string;
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  lowStockThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isLowStock: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** GET /inventory — response */
export interface GetAllInventoryResponse {
  status: boolean;
  message: string;
  data: {
    items: InventoryItem[];
    pagination: Pagination;
  };
}

/** POST /inventory — response */
export interface CreateInventoryResponse {
  status: boolean;
  message: string;
  data: InventoryItem;
}

/** PATCH /inventory/:id — response */
export interface UpdateInventoryResponse {
  status: boolean;
  message: string;
  data: InventoryItem;
}

/** DELETE /inventory/:id — response */
export interface DeleteInventoryResponse {
  status: boolean;
  message: string;
}

export const INVENTORY_UNITS = [
  "litre",
  "ml",
  "kg",
  "gram",
  "piece",
  "packet",
  "box",
] as const;

export function stockState(item: InventoryItem): "OUT" | "LOW" | "OK" {
  if (item.quantity <= 0) return "OUT";
  if (item.quantity <= item.lowStockThreshold) return "LOW";
  return "OK";
}

const iso = (d: string) => new Date(d).toISOString();

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    inventoryId: "603e100a-0730-4ffe-bb60-0c9919b73601",
    name: "Cooking Oil",
    sku: "OIL-COOK-001",
    unit: "litre",
    quantity: 25,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: iso("2026-08-15T14:02:47.961Z"),
    updatedAt: iso("2026-08-15T14:02:47.961Z"),
    isLowStock: false,
  },
  {
    inventoryId: "b1f7c2d4-1a11-4c77-9a01-2f5b0d1e7a22",
    name: "Arabica Coffee Beans",
    sku: "COF-ARA-002",
    unit: "kg",
    quantity: 4,
    lowStockThreshold: 6,
    isActive: true,
    createdAt: iso("2026-08-11T09:20:00.000Z"),
    updatedAt: iso("2026-08-14T10:05:00.000Z"),
    isLowStock: true,
  },
  {
    inventoryId: "c2a8d3e5-2b22-4d88-8b12-3c6a1e2f8b33",
    name: "Full Cream Milk",
    sku: "MLK-FCM-003",
    unit: "litre",
    quantity: 48,
    lowStockThreshold: 12,
    isActive: true,
    createdAt: iso("2026-08-09T07:15:00.000Z"),
    updatedAt: iso("2026-08-15T06:40:00.000Z"),
    isLowStock: false,
  },
  {
    inventoryId: "d3b9e4f6-3c33-4e99-9c23-4d7b2f3a9c44",
    name: "Paneer Block",
    sku: "PNR-BLK-004",
    unit: "kg",
    quantity: 0,
    lowStockThreshold: 3,
    isActive: true,
    createdAt: iso("2026-08-02T12:00:00.000Z"),
    updatedAt: iso("2026-08-13T18:30:00.000Z"),
    isLowStock: true,
  },
  {
    inventoryId: "e4c0f5a7-4d44-4faa-ad34-5e8c3a4b0d55",
    name: "Paper Cups 250ml",
    sku: "PKG-CUP-005",
    unit: "packet",
    quantity: 120,
    lowStockThreshold: 20,
    isActive: false,
    createdAt: iso("2026-07-30T16:45:00.000Z"),
    updatedAt: iso("2026-08-06T11:10:00.000Z"),
    isLowStock: false,
  },
  {
    inventoryId: "f5d1a6b8-5e55-40bb-be45-6f9d4b5c1e66",
    name: "Chocolate Syrup",
    sku: "SYR-CHO-006",
    unit: "ml",
    quantity: 900,
    lowStockThreshold: 500,
    isActive: true,
    createdAt: iso("2026-07-25T08:00:00.000Z"),
    updatedAt: iso("2026-08-12T09:25:00.000Z"),
    isLowStock: false,
  },
  {
    inventoryId: "a6e2b7c9-6f66-41cc-cf56-7a0e5c6d2f77",
    name: "Tomato Ketchup Sachet",
    sku: "SAU-KET-007",
    unit: "box",
    quantity: 2,
    lowStockThreshold: 4,
    isActive: true,
    createdAt: iso("2026-07-21T13:35:00.000Z"),
    updatedAt: iso("2026-08-10T14:50:00.000Z"),
    isLowStock: true,
  },
  {
    inventoryId: "b7f3c8d0-7a77-42dd-d067-8b1f6d7e3a88",
    name: "Basmati Rice",
    sku: "GRN-RIC-008",
    unit: "kg",
    quantity: 60,
    lowStockThreshold: 15,
    isActive: true,
    createdAt: iso("2026-07-18T10:10:00.000Z"),
    updatedAt: iso("2026-08-08T07:05:00.000Z"),
    isLowStock: false,
  },
  {
    inventoryId: "c8a4d9e1-8b88-43ee-e178-9c2a7e8f4b99",
    name: "Butter Salted",
    sku: "DRY-BTR-009",
    unit: "gram",
    quantity: 3500,
    lowStockThreshold: 1000,
    isActive: true,
    createdAt: iso("2026-07-15T15:00:00.000Z"),
    updatedAt: iso("2026-08-04T17:20:00.000Z"),
    isLowStock: false,
  },
  {
    inventoryId: "d9b5e0f2-9c99-44ff-f289-0d3b8f9a5c00",
    name: "Disposable Straws",
    sku: "PKG-STR-010",
    unit: "packet",
    quantity: 8,
    lowStockThreshold: 10,
    isActive: true,
    createdAt: iso("2026-07-12T11:45:00.000Z"),
    updatedAt: iso("2026-08-03T09:15:00.000Z"),
    isLowStock: true,
  },
  {
    inventoryId: "e0c6f1a3-0daa-4500-039a-1e4c9a0b6d11",
    name: "Green Tea Sachets",
    sku: "TEA-GRN-011",
    unit: "box",
    quantity: 14,
    lowStockThreshold: 5,
    isActive: true,
    createdAt: iso("2026-07-08T09:00:00.000Z"),
    updatedAt: iso("2026-08-01T08:30:00.000Z"),
    isLowStock: false,
  },
  {
    inventoryId: "f1d7a2b4-1ebb-4611-14ab-2f5d0b1c7e22",
    name: "Vanilla Ice Cream Tub",
    sku: "FRZ-VAN-012",
    unit: "piece",
    quantity: 6,
    lowStockThreshold: 6,
    isActive: true,
    createdAt: iso("2026-07-05T14:20:00.000Z"),
    updatedAt: iso("2026-07-29T12:00:00.000Z"),
    isLowStock: true,
  },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

/** Mock GET /inventory?page=&limit= */
export async function apiGetAllInventory(
  page = 1,
  limit = 10,
): Promise<GetAllInventoryResponse> {
  await delay(400);
  const total = MOCK_INVENTORY.length;
  const start = (page - 1) * limit;
  return {
    status: true,
    message: "Inventory items fetched successfully",
    data: {
      items: MOCK_INVENTORY.slice(start, start + limit),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    },
  };
}

/** Mock POST /inventory */
export async function apiCreateInventory(
  body: CreateInventoryRequest,
): Promise<CreateInventoryResponse> {
  await delay(600);
  const now = new Date().toISOString();
  return {
    status: true,
    message: "Inventory item created successfully",
    data: {
      inventoryId: uuid(),
      ...body,
      createdAt: now,
      updatedAt: now,
      isLowStock: body.quantity <= body.lowStockThreshold,
    },
  };
}

/** Mock PATCH /inventory/:id */
export async function apiUpdateInventory(
  id: string,
  body: UpdateInventoryRequest,
  current: InventoryItem,
): Promise<UpdateInventoryResponse> {
  await delay(500);
  const merged: InventoryItem = {
    ...current,
    ...body,
    inventoryId: id,
    updatedAt: new Date().toISOString(),
  };
  merged.isLowStock = merged.quantity <= merged.lowStockThreshold;
  return { status: true, message: "Inventory item updated successfully", data: merged };
}

/** Mock DELETE /inventory/:id */
export async function apiDeleteInventory(_id: string): Promise<DeleteInventoryResponse> {
  await delay(400);
  return { status: true, message: "Inventory item deleted successfully" };
}
