export interface User {
  id: string;
  name?: string;
  lastName?: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date;
  isActive: boolean;
  roles?: string[];
  skills?: string[];
}
