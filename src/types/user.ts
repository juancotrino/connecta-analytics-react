export interface User {
  uid: string;
  name?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}
