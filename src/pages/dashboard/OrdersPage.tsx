
import { OrdersManagement } from "@/components/orders/OrdersManagement";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <OrdersManagement />
    </div>
  );
}
