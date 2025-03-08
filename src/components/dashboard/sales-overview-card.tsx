
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BanknoteIcon } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalesData {
  name: string;
  sales: number;
}

interface SalesOverviewCardProps {
  salesData: SalesData[];
}

export function SalesOverviewCard({ salesData }: SalesOverviewCardProps) {
  return (
    <Card className="hover-lift">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BanknoteIcon className="h-5 w-5 mr-2 text-primary" />
          Sales Overview
        </CardTitle>
        <CardDescription>Weekly sales performance</CardDescription>
      </CardHeader>
      <CardContent>            
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => [`R${value}`, 'Sales']} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
