
export type UserRole = "customer" | "driver" | "vendor" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}
