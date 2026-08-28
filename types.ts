
export enum PaymentMethodType {
  QR_CODE = 'QR_CODE',
  DOMESTIC_CARD = 'DOMESTIC_CARD',
  INTERNATIONAL_CARD = 'INTERNATIONAL_CARD',
  MOMO = 'MOMO',
  COD = 'COD'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface Order {
  id: string;
  items: Product[];
  shippingFee: number;
  discount: number;
  createdAt: string;
  customerInfo?: OrderFormData; // Added linkage to customer
}

export interface PaymentMethodConfig {
  id: PaymentMethodType;
  title: string;
  description: string;
  iconName: string; // Mapping string to icon component
}

// Entity: SanPham (Sản phẩm)
export interface ProductDetail {
  id: string;
  name: string;
  category: string; // Added category
  rating: number;
  reviewCount: number;
  soldCount: number;
  price: number;
  originalPrice: number;
  discountRate: number;
  shippingFee: number;
  shippingEstimate: string;
  colors: string[];
  sizes: string[];
  stock: number;
  images: string[];
  videoDuration: string;
  description: string;
}

// Entity: BienThe (Biến thể sản phẩm trong kho)
export interface ProductVariant {
    sku: string;
    productId: string;
    color: string;
    size: string;
    stockQuantity: number;
}

// New types for UC03 - Order Confirmation
export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

// Entity: KhachHang (Thông tin khách hàng)
export interface OrderFormData {
  fullName: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  note: string;
}

// Entity: PaymentTransaction (Giao dịch thanh toán)
export interface PaymentTransaction {
    transactionId: string;
    orderId: string;
    amount: number;
    method: PaymentMethodType;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    timestamp: string;
}

// --- NEW TYPES FOR EXTENDED USE CASES ---

export enum UserRole {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
  SUPPORT = 'SUPPORT',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',       // Chờ thanh toán / Chờ duyệt
  PAID = 'PAID',             // Đã thanh toán / Chờ xác nhận
  PROCESSING = 'PROCESSING', // Đang xử lý
  SHIPPING = 'SHIPPING',     // Đang giao
  DELIVERED = 'DELIVERED',   // Đã giao
  CANCELLED = 'CANCELLED'    // Đã hủy
}

export interface TrackingStep {
  status: OrderStatus;
  date: string;
  description: string;
  completed: boolean;
}

// ==========================================
// THÔNG TIN BẢNG DATABASE MỚI
// Mappings cho các bảng SQL (11 bảng)
// ==========================================

export interface RoleEntity {
  id: number;
  name: string;
}

export interface UserEntity {
  id: number;
  role_id: number;
  email: string;
  password?: string; // Tùy chọn vì không nên gửi password về frontend
}

export interface CustomerEntity {
  id: number;
  user_id: number;
  address: string | null;
  phone: string | null;
}

export interface SellerEntity {
  id: number;
  user_id: number;
  shop_name: string;
  wallet_balance: number;
}

export interface CategoryEntity {
  id: number;
  name: string;
}

export interface ProductEntity {
  id: number;
  seller_id: number;
  category_id: number | null;
  name: string;
  price: number;
  stock: number;
}

export interface CartEntity {
  id: number;
  customer_id: number;
  created_at: string;
}

export interface CartItemEntity {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  added_at: string;
}

export interface OrderEntity {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderItemEntity {
  id: number;
  order_id: number;
  seller_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  shipping_status: string;
  commission_fee: number;
}

export interface PaymentEntity {
  id: number;
  order_id: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  amount: number;
  payment_date: string;
}