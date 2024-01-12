export interface CustomSession {
  user: {
    _id: string;
    email: string;
    id: string;
  };
  expires: string;
  customJwt: string;
}
