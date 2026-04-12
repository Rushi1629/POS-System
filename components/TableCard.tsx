"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Timer,
  UserPlus,
  LogOut,
  CheckCircle,
  CircleX,
  CalendarClock,
  BookmarkPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  seatGuests,
  clearTable,
  updateTableStatus,
} from "@/store/table/tableSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  categoryLabels,
  statusBg,
  statusLabels,
  statusStyles,
  Table,
} from "@/types/types";
import { useAppDispatch } from "@/store/hooks";
import { formatDuration } from "@/utils/utils";

export function TableCard({ table }: { table: Table }) {
  const dispatch = useAppDispatch();

  const [, setTick] = useState(0);
  const [seatDialog, setSeatDialog] = useState(false);
  const [guestInput, setGuestInput] = useState("");

  // ⏱️ Re-render timer every second
  useEffect(() => {
    if (table.timerStart) {
      const interval = setInterval(() => setTick((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [table.timerStart]);

  // ✅ Seat Guests
  const handleSeatGuests = () => {
    const count = parseInt(guestInput);

    if (count > 0 && count <= table.seats) {
      dispatch(seatGuests({ id: table.id, count }));
      setSeatDialog(false);
      setGuestInput("");
    }
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden transition-all hover:shadow-md border p-0 ${statusBg[table.status]} ${
          table.status === "available"
            ? "border-[#2eb860]/30"
            : table.status === "occupied"
              ? "border-[#dc2828]/30"
              : table.status === "reserved"
                ? "border-[#3374db]/30"
                : "border-[#f59f0a]/30"
        }`}
      >
        {/* Top color strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-[0.9px] ${
            table.status === "available"
              ? "bg-[#2eb860]"
              : table.status === "occupied"
                ? "bg-[#dc2828]"
                : table.status === "reserved"
                  ? "bg-[#3374db]"
                  : "bg-[#f59f0a]"
          }`}
        />

        <CardContent className="p-4 pt-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">T-{table.number}</h3>
              <p className="text-xs text-muted-foreground">
                {categoryLabels[table.category]}
              </p>
            </div>

            <Badge
              variant="outline"
              className={`text-xs capitalize ${statusStyles[table.status]}`}
            >
              {statusLabels[table.status]}
            </Badge>
          </div>

          {/* Guests + Timer */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {table.guestCount ? `${table.guestCount}/` : ""}
              {table.seats}
            </span>

            {table.timerStart && (
              <span className="flex items-center gap-1 text-warning font-mono font-medium">
                <Timer className="h-3 w-3 animate-pulse-soft" />
                {formatDuration(table.timerStart)}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 flex-wrap">
            {/* 🟢 Available */}
            {table.status === "available" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => setSeatDialog(true)}
                >
                  <UserPlus className="h-3 w-3 mr-1" /> Seat
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() =>
                    dispatch(
                      updateTableStatus({
                        id: table.id,
                        status: "reserved",
                      }),
                    )
                  }
                >
                  <BookmarkPlus className="h-3 w-3 mr-1" /> Reserve
                </Button>
              </>
            )}

            {/* 🔴 Occupied */}
            {table.status === "occupied" && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => dispatch(clearTable(table.id))}
              >
                <LogOut className="h-3 w-3 mr-1" /> Clear
              </Button>
            )}

            {/* 🔵 Reserved */}
            {table.status === "reserved" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => setSeatDialog(true)}
                >
                  <UserPlus className="h-3 w-3 mr-1" /> Check In
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() =>
                    dispatch(
                      updateTableStatus({
                        id: table.id,
                        status: "available",
                      }),
                    )
                  }
                >
                  <CircleX className="h-3 w-3 mr-1" /> Cancel
                </Button>
              </>
            )}

            {/* 🟡 Cleaning */}
            {table.status === "cleaning" && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() =>
                  dispatch(
                    updateTableStatus({
                      id: table.id,
                      status: "available",
                    }),
                  )
                }
              >
                <CheckCircle className="h-3 w-3 mr-1" /> Mark Ready
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🧾 Seat Guests Dialog */}
      <Dialog open={seatDialog} onOpenChange={setSeatDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Seat Guests at T-{table.number}</DialogTitle>
            <DialogDescription>
              Enter the number of guests for this table.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Number of Guests (max {table.seats})</Label>
              <Input
                type="number"
                min={1}
                max={table.seats}
                value={guestInput}
                className="border text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30"
                onChange={(e) => setGuestInput(e.target.value)}
                placeholder={`1-${table.seats}`}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSeatDialog(false)}>
              Cancel
            </Button>

            <Button
              onClick={handleSeatGuests}
              className="bg-[#e25f28]"
              disabled={
                !guestInput ||
                parseInt(guestInput) < 1 ||
                parseInt(guestInput) > table.seats
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
