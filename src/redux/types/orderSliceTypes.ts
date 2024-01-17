// imports
import { CartType } from "./cartSliceTypes";
import { AddressType } from "./userSliceTypes";

// orderAddress types
export interface OrderAddressArgs {
  jwt: string;
  address: AddressType;
  cartId: string;
}

export interface OrderAddressResponse {
  status: string;
  message: string;
}

// orderCart types
export interface OrderCartArgs {
  jwt: string;
  cartObject: CartType;
}

export interface OrderCartResponse {
  status: string;
  message: string;
}

// paymentCheckout types
export interface PaymentCheckoutArgs {
  cartId: string;
  jwt: string;
}

export interface PaymentCheckoutResponse {
  status: string;
  sessionId?: string;
  message?: string;
}

// paymentConfirmation types
export interface PaymentConfirmationArgs {
  sessionId: string;
  cartId: string;
  jwt: string;
}

export interface PaymentConfirmationResponse {
  status: string;
  message: string;
}

// orderStatus types
export type OrderStatusArgs = {
  cartId: string;
  jwt: string;
} & (
  | { orderStatus: string; isDelivered?: never }
  | { orderStatus?: never; isDelivered: boolean }
);

export interface OrderStatusResponse {
  status: string;
  message: string;
}

// getOrder types
export interface GetOrderArgs {
  cartId: string;
  jwt: string;
}

// Image Type
export interface ImageType {
  url: string;
  alt: string;
  _id: string;
}

// Discount Type
export interface DiscountType {
  percentage?: number;
  startDate?: string | null;
  endDate?: string | null;
}

// Product Type
export interface ProductType {
  discount?: DiscountType;
  _id: string;
  name: string;
  price: number;
  stock?: number;
  category: string;
  images: ImageType[];
}

// Item Type
export interface ItemType {
  product: ProductType;
  quantity: number;
  _id: string;
}

// Cart Type
export interface CartTypeOrder {
  _id: string;
  user: string;
  items: ItemType[];
  totalAmountDiscount: number;
  totalAmount: number;
  appliedCoupon?: string | null;
  shippingCost: number;
}

// OrderItemType
export interface OrderItemType {
  product: string;
  name: string;
  price: number;
  discount?: DiscountType;
  images: ImageType[];
  quantity: number;
}

// OrderStatusType
export enum OrderStatusType {
  Pending = "Pending",
  Processed = "Processed",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

// OrderType
export interface OrderType {
  _id: string;
  userId: string;
  cartId: string;
  totalAmount: number;
  totalAmountDiscount: number;
  shippingCost: number;
  orderStatus: OrderStatusType;
  shippingAddress: AddressType;
  isDelivered: boolean;
  items: OrderItemType[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  appliedCoupon?: string | null;
  deliveryTime?: number;
  userOrderCount?: number;
}

export interface GetOrderResponse {
  status: string;
  order?: OrderType;
  message?: string;
}

export type GetOrdersArgs = string;

export type GetOrdersResponse = {
  status: string;
  orders?: OrderType[];
  message?: string;
};

export type ErrorOrderState = string | null;
