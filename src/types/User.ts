export type User = {
  id: string
  email: string
  role: UserRole
  points: number
}

export enum UserRole {
  Admin = 'Admin',
  Customer = 'Customer'
}
