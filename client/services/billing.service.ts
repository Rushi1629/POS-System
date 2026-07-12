import { BillListItem, GenerateBillRequest, PayBillRequest } from "@/types/billing-types";
import { fetcher } from "../client";

export const fetchAllBills = async (): Promise<BillListItem[]> => {
  const res = await fetcher("/billing");

  return res.data;
};

export const payBill = async (data: PayBillRequest) => {
  const res = await fetcher("/billing/pay", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.data;
};

export const generateBill = async (data: GenerateBillRequest) => {
  const res = await fetcher("/billing/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.data;
};
