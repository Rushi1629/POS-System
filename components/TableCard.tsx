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
import { useEditTable, useEditTableSession } from "@/api/hooks/useTable";
import {
  EditTableSessionPayload,
  FetchTableResponse,
} from "@/types/table-types";

export function TableCard({
  table,
  session,
}: {
  table: FetchTableResponse;
  session: EditTableSessionPayload;
}) {
  // const dispatch = useAppDispatch();

  // const { mutateAsync: updateTable, isPending } = useEditTable();
  const { mutateAsync: updateTableSession, isPending } = useEditTableSession();

  const [, setTick] = useState(0);
  const [seatDialog, setSeatDialog] = useState(false);
  const [guestInput, setGuestInput] = useState("");
  const [localStartTimes, setLocalStartTimes] = useState<
    Record<number, number>
  >({});

  // ⏱️ Re-render timer every second
  useEffect(() => {
    if (table.enableTimeRate) {
      const interval = setInterval(() => setTick((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [table.enableTimeRate, setTick]);

  const handleSeatGuests = async () => {
    const count = parseInt(guestInput);

    if (count > 0 && count <= table.capacity) {
      await updateTableSession({
        tableId: table.id,
        guestCount: count,
        status: "OCCUPIED",
        notes: "",
      });

      // ✅ set frontend start time
      setLocalStartTimes((prev) => ({
        ...prev,
        [table.id]: Date.now(),
      }));

      setSeatDialog(false);
      setGuestInput("");
    }
  };

  const startTime = localStartTimes[table.id];
  const getElapsedSeconds = () => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const getTotalAmount = () => {
    if (!startTime || !table.enableTimeRate) return 0;

    const minutes = getElapsedSeconds() / 60;

    return minutes * table.ratePerMinute * session?.guestCount;
  };

  return (
    <>
      <Card
        className={`relative overflow-hidden transition-all hover:shadow-md border p-0 ${statusBg[table.tableStatus]} ${
          table.tableStatus === "AVAILABLE"
            ? "border-[#2eb860]/30"
            : table.tableStatus === "OCCUPIED"
              ? "border-[#dc2828]/30"
              : table.tableStatus === "RESERVED"
                ? "border-[#3374db]/30"
                : "border-[#f59f0a]/30"
        }`}
      >
        {/* Top color strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-[0.9px] ${
            table.tableStatus === "AVAILABLE"
              ? "bg-[#2eb860]"
              : table.tableStatus === "OCCUPIED"
                ? "bg-[#dc2828]"
                : table.tableStatus === "RESERVED"
                  ? "bg-[#3374db]"
                  : "bg-[#f59f0a]"
          }`}
        />

        <CardContent className="p-4 pt-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-lg">{table.name}</h3>
              <p className="text-xs text-muted-foreground">{table.type}</p>
            </div>

            <Badge
              variant="outline"
              className={`text-xs capitalize ${statusStyles[table.tableStatus]}`}
            >
              {statusLabels[table.tableStatus]}
            </Badge>
          </div>

          {/* Guests + Timer */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {`${session?.guestCount ?? 0}/${table.capacity ?? 0}`}
              {/* {table.capacity} */}
            </span>

            {table.enableTimeRate && startTime && (
              <div className="flex flex-col text-xs font-mono">
                <span>⏱ {Math.floor(getElapsedSeconds() / 60)}m</span>

                <span className="text-green-600 font-semibold">
                  ₹ {getTotalAmount().toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 flex-wrap">
            {/* 🟢 Available */}
            {table.tableStatus === "AVAILABLE" && (
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
                  disabled={isPending}
                  className="text-xs h-7"
                  onClick={async () => {
                    await updateTableSession({
                      tableId: table.id,
                      guestCount: session?.guestCount ?? 0,
                      status: "RESERVED",
                      notes: "",
                    });
                  }}
                >
                  {isPending ? (
                    "Loading..."
                  ) : (
                    <>
                      <BookmarkPlus className="h-3 w-3 mr-1" /> Reserve
                    </>
                  )}
                </Button>
              </>
            )}

            {/* 🔴 Occupied */}
            {table.tableStatus === "OCCUPIED" && (
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                className="text-xs h-7"
                onClick={async () => {
                  await updateTableSession({
                    tableId: table.id,
                    guestCount: session?.guestCount ?? 0,
                    status: "CLEANING",
                    notes: "",
                  });
                }}
              >
                {isPending ? (
                  "Loading..."
                ) : (
                  <>
                    <LogOut className="h-3 w-3 mr-1" /> Clear
                  </>
                )}
              </Button>
            )}

            {/* 🔵 Reserved */}
            {table.tableStatus === "RESERVED" && (
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
                  disabled={isPending}
                  onClick={async () => {
                    await updateTableSession({
                      tableId: table.id,
                      guestCount: session?.guestCount ?? 0,
                      status: "AVAILABLE",
                      notes: "",
                    });
                  }}
                >
                  {isPending ? (
                    "Loading..."
                  ) : (
                    <>
                      <CircleX className="h-3 w-3 mr-1" /> Cancel
                    </>
                  )}
                </Button>
              </>
            )}

            {/* 🟡 Cleaning */}
            {table.tableStatus === "CLEANING" && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                disabled={isPending}
                onClick={async () => {
                  await updateTableSession({
                    tableId: table.id,
                    guestCount: session?.guestCount ?? 0,
                    status: "AVAILABLE",
                    notes: "",
                  });
                }}
              >
                {isPending ? (
                  "Loading..."
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" /> Mark Ready
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 🧾 Seat Guests Dialog */}
      <Dialog open={seatDialog} onOpenChange={setSeatDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Seat Guests at {table.name}</DialogTitle>
            <DialogDescription>
              Enter the number of guests for this table.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Number of Guests (max {table.capacity})</Label>
              <Input
                type="number"
                min={1}
                max={table.capacity}
                value={guestInput}
                className="border text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/30"
                onChange={(e) => setGuestInput(e.target.value)}
                placeholder={`1-${table.capacity}`}
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
                parseInt(guestInput) > table.capacity
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
