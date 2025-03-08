
export interface PopularItem {
  id: number;
  name: string;
  price: string;
  orders: number;
  image: string;
}

export interface SalesData {
  name: string;
  sales: number;
}

export interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
}

// Mock data for dashboard
export const popularItems: PopularItem[] = [
  {
    id: 1,
    name: "Chicken Burger",
    price: "$8.99",
    orders: 48,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&h=80&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Veggie Pizza",
    price: "$12.99",
    orders: 36,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "French Fries",
    price: "$3.99",
    orders: 52,
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=80&h=80&auto=format&fit=crop"
  },
];

export const salesData: SalesData[] = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 1800 },
  { name: "Wed", sales: 1600 },
  { name: "Thu", sales: 2200 },
  { name: "Fri", sales: 2800 },
  { name: "Sat", sales: 3200 },
  { name: "Sun", sales: 2400 },
];

export const revenueData: RevenueData[] = [
  { name: "Jan", revenue: 12000, orders: 420 },
  { name: "Feb", revenue: 14000, orders: 460 },
  { name: "Mar", revenue: 16000, orders: 500 },
  { name: "Apr", revenue: 18000, orders: 550 },
  { name: "May", revenue: 17000, orders: 520 },
  { name: "Jun", revenue: 19000, orders: 580 },
];
