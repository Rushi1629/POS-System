import { apiGenerateBill, BillListItem } from "@/types/billing-types";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Plus, Receipt } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../input";

const GenerateBillDialog = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (b: BillListItem) => void;
}) => {
  const [orderId, setOrderId] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!orderId || !mobile) {
      toast.error("Order ID and mobile number are required");
      return;
    }
    setLoading(true);
    try {
      const data = await apiGenerateBill({
        orderId: Number(orderId),
        mobileNumber: mobile,
        notes: notes || "n/a",
      });
      onCreated({
        ...data,
        notes: data.notes,
        order: data.order,
      });
      toast.success(`Bill ${data.billNumber} generated`);
      onClose();
      setOrderId("");
      setMobile("");
      setNotes("");
    } catch {
      toast.error("Failed to generate bill");
    } finally {
      setLoading(false);
    }
  };
  return (
    <DialogContent className="sm:max-w-lg flex flex-col max-h-[80vh]">
      <DialogHeader className="sticky top-0 z-10 bg-background pb-2">
        <DialogTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" /> Generate Bill
        </DialogTitle>
        <DialogDescription>
          Enter the order details to create a new billing record.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2 max-h-[60vh] px-3 overflow-y-auto no-scrollbar">
        <div className="grid gap-2">
          <Label htmlFor="orderId">Order ID</Label>
          <Input
            id="orderId"
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. 6"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="9167939647"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes"
            rows={3}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={loading} className="gap-1">
          <Plus className="h-4 w-4" />
          {loading ? "Generating…" : "Generate Bill"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default GenerateBillDialog;
