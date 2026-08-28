import { Order, PaymentMethodConfig, PaymentMethodType, ProductDetail, CartItem } from './types';

export const MOCK_ORDER: Order = {
  id: "DH-20241228", // Updated ID to match wireframe
  createdAt: new Date().toISOString(),
  shippingFee: 30000,
  discount: 50000,
  items: [
    {
      id: "p1",
      name: "Áo Polo Nam Gucci Maxi GG Silk Cotton",
      price: 12000000,
      quantity: 1,
      variant: "Freesize",
      image: "/Image-Product/Áo polo Nam.jpg"
    },
    {
      id: "p2",
      name: "Quần short tập luyện adidas Nam",
      price: 750000,
      quantity: 1,
      variant: "Freesize",
      image: "/Image-Product/Quần Short Nam.jpg"
    }
  ]
};

// Data specifically for the UC03 Wireframe display
export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "c1",
    name: "Áo Polo Nam Gucci Maxi GG Silk Cotton",
    size: "Freesize",
    price: 12000000,
    quantity: 1,
    image: "/Image-Product/Áo polo Nam.jpg"
  },
  {
    id: "c2",
    name: "Quần short tập luyện adidas Nam",
    size: "Freesize",
    price: 750000,
    quantity: 1,
    image: "/Image-Product/Quần Short Nam.jpg"
  }
];

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: PaymentMethodType.QR_CODE,
    title: "Quét mã VNPAY-QR (Khuyên dùng)",
    description: "Quét mã qua ứng dụng ngân hàng/Ví VNPAY",
    iconName: "qr"
  },
  {
    id: PaymentMethodType.DOMESTIC_CARD,
    title: "Thẻ ATM / Internet Banking",
    description: "Hỗ trợ 40+ ngân hàng tại Việt Nam",
    iconName: "credit-card"
  },
  {
    id: PaymentMethodType.INTERNATIONAL_CARD,
    title: "Thẻ Quốc tế (Visa/Master/JCB)",
    description: "Phí chuyển đổi ngoại tệ có thể áp dụng",
    iconName: "globe"
  },
  {
    id: PaymentMethodType.MOMO,
    title: "Ví điện tử MoMo",
    description: "Thanh toán qua ứng dụng MoMo",
    iconName: "wallet"
  },
  {
    id: PaymentMethodType.COD,
    title: "Thanh toán khi nhận hàng (COD)",
    description: "Thanh toán tiền mặt cho Shipper khi nhận hàng",
    iconName: "money"
  }
];

export const MOCK_PRODUCT_DETAIL: ProductDetail = {
  id: "DIOR-TSHIRT-001",
  name: "Áo Thun DIOR - Chính Hãng",
  category: "Thời trang nam",
  rating: 4.9,
  reviewCount: 152,
  soldCount: 1200, // 1.2k
  price: 1889000,
  originalPrice: 2500000,
  discountRate: 24,
  shippingFee: 15000,
  shippingEstimate: "30/12 - 02/01",
  colors: ["Trắng", "Đen", "Xanh Navy"],
  sizes: ["S", "M", "L", "XL"],
  stock: 58,
  videoDuration: "01:45s",
  images: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", // White Tshirt main
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200", // Detail 1
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=200", // Detail 2
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=200"  // Detail 3
  ],
  description: "Đánh giá (152) Thông số kỹ thuật\n- Chất liệu: Cotton 100% co giãn 4 chiều\n- Xuất xứ: Việt Nam\n- Áo thun Dior phong cách trẻ trung, năng động, phù hợp cho cả nam và nữ. Chất vải thấm hút mồ hôi tốt, không bai dão khi giặt."
};

// Danh sách sản phẩm cho Trang Chủ
export const MOCK_PRODUCTS_LIST: ProductDetail[] = [
  MOCK_PRODUCT_DETAIL,
  {
    id: "JEANS-002",
    name: "Quần Jeans Slimfit Rách Gối",
    category: "Thời trang nam",
    rating: 4.7,
    reviewCount: 89,
    soldCount: 450,
    price: 550000,
    originalPrice: 750000,
    discountRate: 27,
    shippingFee: 20000,
    shippingEstimate: "2-3 ngày",
    colors: ["Xanh Nhạt", "Xanh Đậm", "Đen"],
    sizes: ["29", "30", "31", "32"],
    stock: 120,
    videoDuration: "00:45s",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Quần Jeans form Slimfit tôn dáng, chất liệu denim co giãn nhẹ thoải mái vận động."
  },
  {
    id: "HOODIE-003",
    name: "Áo Hoodie Streetwear Unisex",
    category: "Áo khoác & Hoodie",
    rating: 4.8,
    reviewCount: 210,
    soldCount: 890,
    price: 420000,
    originalPrice: 600000,
    discountRate: 30,
    shippingFee: 15000,
    shippingEstimate: "3-4 ngày",
    colors: ["Xám", "Đen", "Be"],
    sizes: ["M", "L", "XL"],
    stock: 45,
    videoDuration: "00:30s",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Áo Hoodie chất nỉ bông dày dặn, giữ ấm tốt, phong cách đường phố năng động."
  },
  {
    id: "SNEAKER-004",
    name: "Giày Sneaker Cổ Thấp Basic",
    category: "Giày dép",
    rating: 4.6,
    reviewCount: 56,
    soldCount: 120,
    price: 890000,
    originalPrice: 1200000,
    discountRate: 25,
    shippingFee: 0,
    shippingEstimate: "2-4 ngày",
    colors: ["Trắng", "Đen"],
    sizes: ["39", "40", "41", "42", "43"],
    stock: 30,
    videoDuration: "01:00s",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Giày sneaker thiết kế tối giản, dễ phối đồ, đế cao su êm ái."
  },
  {
    id: "WATCH-005",
    name: "Đồng Hồ Nam Dây Da Cổ Điển",
    category: "Phụ kiện",
    rating: 5.0,
    reviewCount: 12,
    soldCount: 45,
    price: 2500000,
    originalPrice: 3000000,
    discountRate: 15,
    shippingFee: 0,
    shippingEstimate: "1-2 ngày",
    colors: ["Nâu", "Đen"],
    sizes: ["Freesize"],
    stock: 10,
    videoDuration: "",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Đồng hồ máy Quartz Nhật Bản, mặt kính Sapphire chống xước, dây da bò thật."
  },
  {
    id: "JACKET-006",
    name: "Áo Khoác Bomber Gió Mùa",
    category: "Áo khoác & Hoodie",
    rating: 4.5,
    reviewCount: 78,
    soldCount: 300,
    price: 650000,
    originalPrice: 950000,
    discountRate: 32,
    shippingFee: 25000,
    shippingEstimate: "3-5 ngày",
    colors: ["Xanh Rêu", "Đen"],
    sizes: ["L", "XL", "XXL"],
    stock: 80,
    videoDuration: "",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Áo khoác Bomber chất liệu dù chống nước nhẹ, lót lưới thoáng khí."
  },
  {
    id: "CAP-007",
    name: "Mũ Lưỡi Trai NY",
    category: "Phụ kiện",
    rating: 4.9,
    reviewCount: 340,
    soldCount: 2000,
    price: 150000,
    originalPrice: 250000,
    discountRate: 40,
    shippingFee: 15000,
    shippingEstimate: "1-3 ngày",
    colors: ["Đen", "Trắng", "Hồng"],
    sizes: ["Freesize"],
    stock: 200,
    videoDuration: "",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Mũ lưỡi trai form cứng cáp, logo thêu nổi 3D sắc nét."
  },
  {
    id: "BAG-008",
    name: "Túi Đeo Chéo Canvas",
    category: "Phụ kiện",
    rating: 4.4,
    reviewCount: 45,
    soldCount: 150,
    price: 180000,
    originalPrice: 220000,
    discountRate: 18,
    shippingFee: 15000,
    shippingEstimate: "2-4 ngày",
    colors: ["Be", "Đen"],
    sizes: ["Freesize"],
    stock: 50,
    videoDuration: "",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=200"
    ],
    description: "Túi vải Canvas dày dặn, nhiều ngăn tiện lợi đựng điện thoại, ví."
  }
];