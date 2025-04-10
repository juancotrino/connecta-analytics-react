export interface User {
  uid: string;
  name?: string;
  avatar?: string;
  email?: string;
  roles: string[];

  [key: string]: unknown;
}
