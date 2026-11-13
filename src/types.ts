export type CategoryType = 
  | 'Kurta' 
  | '2 Piece Kurta Suit Set' 
  | '3 Piece Kurta Suit Set' 
  | 'Dresses' 
  | 'Plus Size'
  | 'Earrings'
  | 'Bracelet'
  | 'Anti tarnish bracelet'
  | 'Rings'
  | 'Necklace'
  | 'Daily wear jewellery'
  | string;

export type SizeType = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | '4XL' | '5XL' | 'Free Size' | string;

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: CategoryType | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  fabric: 'Mul Cotton' | 'Mul Chanderi' | 'Silk Chanderi' | 'Georgette' | 'Modal Silk' | string;
  description: string;
  details: string[];
  careInstructions: string[];
  sizes: SizeType[];
  colors: { name: string; hex: string }[];
  isNew?: boolean;
  isBestseller?: boolean;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: SizeType;
  selectedColor?: string;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  orderNotes?: string;
}

export interface FranchiseEnquiry {
  name: string;
  phone: string;
  email: string;
  city: string;
  experience?: string;
  message: string;
}

export interface Category {
  _id: string;
  name: string;
  image: string;
  description: string;
  count: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Address {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  isBlocked: boolean;
  address?: Address;
  createdAt: string;
  lastLoginAt?: string;
  orders?: number;
  spent?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: string;
  color?: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  id: string;
  orderNumber: string;
  user?: { _id: string; name: string; email: string; phone?: string } | string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'razorpay' | 'cod' | 'whatsapp';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: string;
  trackingNumber?: string;
  courier?: string;
  adminNote?: string;
  statusHistory: { status: string; note?: string; at: string }[];
  createdAt: string;
}

export interface PublicSettings {
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  codEnabled: boolean;
  whatsappOrderEnabled: boolean;
  shippingFee: number;
  freeShippingAbove: number;
}

export const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned',
];
