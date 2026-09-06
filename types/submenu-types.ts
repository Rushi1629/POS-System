export type SubmenuItemPayload = {
  name: string;
  price: string;
  available: boolean;
  description?: string;
};

export type SubmenuDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: SubmenuItemPayload | null;
  onSave: (data: SubmenuItemPayload) => Promise<void>;
  loading?: boolean;
};

export type FetchSubmenuItem = {
  id: string;
  name: string;
  price: string; // ⚠️ API returns string, not number
  available: boolean;
  description: string;
  imageUrl: string | null;
};

export type FetchSubmenuParams = {
  page: number;
  limit: number;
  search?: string;
  status?: string;
};

export type SubmenuPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type FetchSubmenuResponse = {
  status: boolean;
  message: string;
  data: FetchSubmenuItem[];
  pagination: SubmenuPagination;
};
