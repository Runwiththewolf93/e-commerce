// getUserCart types
export interface GetUserCartArgs {
  jwt: string;
}

export interface ImageType {
  url: string;
  alt: string;
  _id: string;
}

export interface ProductType {
  discount?: {
    percentage: number;
    startDate?: string;
    endDate?: string;
  };
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  images: ImageType[];
}

export interface CartItem {
  product: ProductType;
  quantity: number;
  _id: string;
}

export interface CartType {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmountDiscount: number;
  totalAmount: number;
  shippingCost: number;
  totalWeight: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  appliedCoupon?: string;
}

export interface GetUserCartResponse {
  status: "success" | "error";
  cart?: CartType;
  message?: string;
}

// addToCart types
export interface AddToCartArgs {
  productId: string;
  quantity: number;
  jwt: string;
}

export interface AddToCartResponse {
  status: "success" | "error";
  message?: string;
  cart?: CartType;
}

// deleteFromCart types
export interface DeleteFromCartArgs {
  productId: string;
  quantity?: number;
  jwt: string;
  removeCartItem?: boolean;
}

export interface DeleteFromCartResponse {
  status: "success" | "error";
  message?: string;
  cart?: CartType;
}

// applyCoupon types
export interface ApplyCouponArgs {
  code: string;
  cartId: string;
  jwt: string;
}

export interface ApplyCouponResponse {
  status: "success" | "error";
  message: string;
  cart?: CartType;
}

// excludeCoupon types
export interface ExcludeCouponArgs {
  cartId: string;
  jwt: string;
}

export interface ExcludeCouponResponse {
  status: "success" | "error";
  message: string;
  cart?: CartType;
}

// addCoupon types
export interface AddCouponArgs {
  code: string;
  discountPercentage: string;
  expirationDate: string;
  jwt: string;
}

export interface CouponType {
  _id: string;
  code: string;
  discountPercentage: number;
  expirationDate: string;
  usedBy: Array<{
    user: string;
    _id: string;
    usedOn: string;
  }>;
  __v: number;
  updatedAt: string;
}

export interface AddCouponResponse {
  status: "success" | "error";
  message: string;
  coupon?: CouponType;
}

// deleteCoupon types
export interface DeleteCouponArgs {
  code: string;
  jwt: string;
}

export interface DeleteCouponResponse {
  status: "success" | "error";
  message: string;
}

// removeCart types
export interface RemoveCartArgs {
  cartId: string;
  jwt: string;
}

export interface RemoveCartResponse {
  status: "success" | "error";
  message: string;
}

export type ErrorCartState = string | null;
