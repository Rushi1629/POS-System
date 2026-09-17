import { OrderStatus, STATUS_STYLES } from '@/types/order-status-types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const OrderStausStatusBadge = ({ status }: { status: OrderStatus }) => {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-full border-transparent px-3 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </Badge>
  )
}

export default OrderStausStatusBadge