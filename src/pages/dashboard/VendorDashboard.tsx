
import { PopularItemsCard } from "@/components/dashboard/popular-items-card";
import { SalesOverviewCard } from "@/components/dashboard/sales-overview-card";
import { BusinessAnalyticsCard } from "@/components/dashboard/business-analytics-card";
import { popularItems, salesData, revenueData } from "@/components/dashboard/dashboard-data";

export default function VendorDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PopularItemsCard items={popularItems} />
        <SalesOverviewCard salesData={salesData} />
      </div>
      
      <BusinessAnalyticsCard revenueData={revenueData} />
    </div>
  );
}
