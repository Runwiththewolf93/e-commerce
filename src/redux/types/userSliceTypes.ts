// getUser types
export interface GetUserArgs {
  jwt: string;
}

export interface AddressType {
  city: string;
  street: string;
  zip: string;
  municipality: string;
  name: string;
  streetNumber: number;
  surname: string;
  phoneNumber: string;
}

export interface UserType {
  _id: string;
  username: string;
  email: string;
  roles: Array<"admin" | "customer">;
  createdAt: string;
  __v: number;
  address?: AddressType;
  updatedAt: string;
}

export interface GetUserResponse {
  status: string;
  user?: UserType;
  message?: string;
}

// userAddress types
export interface UserAddressArgs {
  jwt: string;
  address: AddressType;
}

export interface UserAddressResponse {
  status: string;
  message: string;
}

// resetUserPassword types
export interface ResetUserPasswordArgs {
  jwt: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface ResetUserPasswordResponse {
  status: string;
  message: string;
}

// registerUser types
export interface RegisterUserType {
  name: string;
  email: string;
  password?: string;
}

export interface RegisterUserArgs {
  name: string;
  email: string;
  password: string;
}

export interface RegisterUserResponse {
  user: {
    name: string;
    email: string;
  };
  status: string;
  message?: string;
}

// checkAdmin types
export interface CheckAdminArgs {
  jwt: string;
}

export interface CheckAdminResponse {
  status: string;
  isAdmin?: boolean;
  message?: string;
}

export type ErrorUserState = string | null;
