"use client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CircleDot, Clock, Receipt, Soup } from "lucide-react";
import {
  ActiveTarget,
  OrderItem,
  OrderStatus,
  TableOrders,
} from "@/types/order-status-types";
import OrderStatusStatCard from "@/components/OrderStatusStatCard";
import OrderStatusTableCard from "@/components/OrderStatusTableCard";
import OrderStatusUpdateDialog from "@/components/OrderStatusUpdateDialog";
import { UserRole } from "@/types/types";
import {
  useFetchOrdersTableWise,
  useUpdateOrderStatus,
} from "@/client/hooks/useOrder";
import ApiLoader from "@/components/ApiLoader";
import { useProfile } from "@/client/hooks/useAuth";

export default function page() {
  const { mutate: updateOrderStatus, isPending: isUpdateOrderPending } =
    useUpdateOrderStatus();

  const { data: profile } = useProfile();

  const {
    data: TableWiseOrders,
    isLoading: isTableWiseLoading,
    isError: isTableWiseError,
  } = useFetchOrdersTableWise();

  useEffect(() => {
    if (!TableWiseOrders) return;

    const mapped: TableOrders[] = TableWiseOrders.data.map((table: any) => ({
      tableId: table.tableId,
      tableName: table.tableName,
      orders: table.orders.map((order: any) => ({
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        tableId: order.tableId,
        orderNumber: order.orderNumber,
        orderType: order.orderType,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        totalAmount: order.totalAmount,
        notes: order.notes,

        // 🔥 IMPORTANT: filter cancelled items
        items: order.items
          .filter((item: any) => !item.isCancelled)
          .map((item: any) => ({
            orderItemId: item.orderItemId,
            orderItemStatus: item.orderItemStatus,
            orderId: item.orderId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            notes: item.notes,
            isCancelled: item.isCancelled,

            menuItem: {
              menuItemId: item.menuItem.menuItemId,
              id: item.menuItem.id,
              name: item.menuItem.name,
              price: item.menuItem.price,
              menuType: item.menuItem.menuType,
            },

            // 🔥 filter cancelled sub items
            orderSubMenuItems:
              item.orderSubMenuItems
                ?.filter((sub: any) => !sub.isCancelled)
                .map((sub: any) => ({
                  orderSubMenuItemId: sub.orderSubMenuItemId,
                  quantity: sub.quantity,
                  unitPrice: sub.unitPrice,
                  totalPrice: sub.totalPrice,
                  notes: sub.notes,
                  isCancelled: sub.isCancelled,
                  subMenuItem: {
                    subMenuItemId: sub.subMenuItem.subMenuItemId,
                    id: sub.subMenuItem.id,
                    name: sub.subMenuItem.name,
                    price: sub.subMenuItem.price,
                  },
                })) || [],
          })),
      })),
    }));

    setTables(mapped);
  }, [TableWiseOrders]);

  const role = (profile?.role?.name as UserRole | undefined) ?? "Super Admin";
  const [tables, setTables] = useState<TableOrders[]>([]);
  const [target, setTarget] = useState<ActiveTarget | null>(null);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => {
    if (!tables.length) {
      return { tables: 0, orders: 0, items: 0, pending: 0 };
    }

    const all = tables.flatMap((t) => t.orders.flatMap((o) => o.items));

    return {
      tables: tables.length,
      orders: tables.reduce((n, t) => n + t.orders.length, 0),
      items: all.length,
      pending: all.filter((i) => i.orderItemStatus === "PENDING").length,
    };
  }, [tables]);

  function applyStatus(orderId: number, status: OrderStatus) {
    setTables((prev) =>
      prev.map((t) => ({
        ...t,
        orders: t.orders.map((o) =>
          o.orderId === orderId ? { ...o, orderStatus: status } : o,
        ),
      })),
    );
  }

  async function confirmUpdate() {
    if (!target || !pendingStatus) return;
    setSubmitting(true);
    try {
      await updateOrderStatus({
        orderId: target.orderId,
        status: pendingStatus,
      });
      applyStatus(target.orderId, pendingStatus);
      toast.success(`Order status updated to ${pendingStatus}`, {
        description: `${target.orderNumber ?? `Order #${target.orderId}`} • ${target.tableName}`,
      });
      setTarget(null);
      setPendingStatus(null);
    } catch (e) {
      toast.error("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  }

  if (isTableWiseLoading) {
    return <ApiLoader message="Fetching orders..." />;
  }

  if (isUpdateOrderPending) {
    return <ApiLoader message="Updating order status..." />;
  }

  return (
    <div className="">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Order Status Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Update order status across the entire order from one place.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live sync · just now
        </div>
      </div>

      <div className="my-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <OrderStatusStatCard
          label="Active Tables"
          value={totals.tables}
          icon={<Receipt className="size-5" />}
        />
        <OrderStatusStatCard
          label="Open Orders"
          value={totals.orders}
          icon={<CircleDot className="size-5" />}
        />
        <OrderStatusStatCard
          label="Total Items"
          value={totals.items}
          icon={<Soup className="size-5" />}
        />
        <OrderStatusStatCard
          label="Pending"
          value={totals.pending}
          icon={<Clock className="size-5" />}
          tone="primary"
        />
      </div>

      <div className="space-y-6">
        {tables.map((table) => (
          <OrderStatusTableCard
            key={table.tableId}
            table={table}
            role={role}
            onPick={(order) => {
              setTarget({
                orderId: order.orderId,
                orderStatus: order.orderStatus,
                tableName: table.tableName,
                orderNumber: order.orderNumber,
              });
              setPendingStatus(null);
            }}
          />
        ))}
      </div>

      <OrderStatusUpdateDialog
        open={!!target}
        target={target}
        role={role}
        pending={pendingStatus}
        submitting={submitting}
        onPending={setPendingStatus}
        onClose={() => {
          if (submitting) return;
          setTarget(null);
          setPendingStatus(null);
        }}
        onConfirm={confirmUpdate}
      />
    </div>
  );
}
