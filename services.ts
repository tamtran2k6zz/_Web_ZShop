import { HeThongBanHangDB } from './database.ts';
import { CartItem, Order, OrderFormData, PaymentMethodType, ProductDetail, TrackingStep, OrderStatus } from './types.ts';

/**
 * SERVICE LAYER - NHÓM LỚP CONTROL
 */

// 1. SanPhamService: Xử lý logic liên quan đến sản phẩm (UC01, UC02)
export class SanPhamService {
    static layChiTietSanPham(id: string): ProductDetail {
        // Có thể thêm logic business: Kiểm tra sản phẩm có đang bị khóa không, tính lại giá khuyến mãi động...
        return HeThongBanHangDB.getSanPhamById(id);
    }

    static layDanhSachSanPham(): ProductDetail[] {
        return HeThongBanHangDB.getAllSanPham();
    }

    static timKiemSanPham(tuKhoa: string): ProductDetail[] {
        // Có thể thêm logic lưu lịch sử tìm kiếm, gợi ý từ khóa, v.v.
        return HeThongBanHangDB.searchSanPham(tuKhoa);
    }
}

// 2. DatHangService: Xử lý logic đặt hàng, giỏ hàng (UC03, UC05, UC06)
export class DatHangService {
    static currentOrderId: string = 'DH-20241228';

    static tinhTongTienGioHang(items: CartItem[]): number {
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    static async taoDonHangNhap(items: CartItem[], customerInfo: OrderFormData): Promise<Order> {
        const subtotal = this.tinhTongTienGioHang(items);
        const shippingFee = 30000; 
        const discount = 0; 
        const finalTotal = subtotal + shippingFee - discount;
        
        const newOrder: Order = {
            id: `DH-${Date.now().toString().slice(-6)}`, 
            items: items.map(i => ({
                id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, variant: i.size
            })),
            shippingFee, discount, createdAt: new Date().toISOString(), customerInfo
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    customerInfo,
                    total_amount: finalTotal
                })
            });
            const data = await response.json();
            if (data.success) {
                newOrder.id = data.orderId;
                this.currentOrderId = data.orderId;
            }
        } catch (e) {
            console.error("Lỗi khi kết nối DB:", e);
            HeThongBanHangDB.saveDonHang(newOrder); // Fallback mock
        }
        return newOrder;
    }

    static traCuuDonHang(keyword: string): TrackingStep[] | null {
        // Logic business: Validate keyword, format keyword...
        if (!keyword) return null;
        return HeThongBanHangDB.getLichSuDonHang(keyword);
    }
}

// 3. ThanhToanService: Xử lý giao dịch thanh toán (UC04)
export class ThanhToanService {
    static async xuLyThanhToan(orderId: string, amount: number, method: PaymentMethodType): Promise<boolean> {
        console.log(`Service: Đang thực hiện thanh toán cho đơn ${orderId} qua ${method}...`);
        try {
            const isSuccess = (method === PaymentMethodType.QR_CODE || method === PaymentMethodType.COD);
            
            const response = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_id: orderId,
                    method: method,
                    amount: amount,
                    status: isSuccess ? 'SUCCESS' : 'FAILED'
                })
            });
            const data = await response.json();
            
            if (!isSuccess) {
                throw new Error("GATEWAY_TIMEOUT");
            }
            return data.success;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

// 4. GioHangService: Xử lý giỏ hàng API liên kết với SQL Database
export class GioHangService {
    static async layGioHang(customerId: number = 1): Promise<CartItem[]> {
        try {
            const response = await fetch('http://localhost:5000/api/carts', {
                headers: { 'x-customer-id': customerId.toString() }
            });
            if (!response.ok) return [];
            return await response.json();
        } catch(e) {
            console.error("Lỗi lấy giỏ hàng từ CSDL", e);
            return [];
        }
    }

    static async themVaoGio(item: CartItem, customerId: number = 1): Promise<CartItem[]> {
        try {
            const response = await fetch('http://localhost:5000/api/carts/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-customer-id': customerId.toString() },
                body: JSON.stringify({
                    product_id: typeof item.id === 'string' && item.id.startsWith('PROD') ? 1 : item.id, // Fallback if dummy string
                    quantity: item.quantity,
                    size: item.size
                })
            });
            return await response.json();
        } catch(e) {
            console.error("Lỗi thêm vào giỏ hàng (DB)", e);
            return [];
        }
    }

    static async xoaKhoiGio(cartItemId: string | number, customerId: number = 1): Promise<CartItem[]> {
        try {
            const response = await fetch('http://localhost:5000/api/carts/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-customer-id': customerId.toString() },
                body: JSON.stringify({
                    cartItemId
                })
            });
            return await response.json();
        } catch(e) {
            console.error("Lỗi xoá khỏi giỏ hàng (DB)", e);
            return [];
        }
    }
}

// 5. SanPhamAdminService: Xử lý quản lý sản phẩm giao tiếp REST API
export class SanPhamAdminService {
    static async layTatCaSanPham(): Promise<any[]> {
        try {
            const res = await fetch('http://localhost:5000/api/products');
            if (res.ok) return await res.json();
            return [];
        } catch (e) {
            console.error("Lỗi lấy SP backend", e);
            return [];
        }
    }

    static async themMoiSanPham(data: { name: string, price: number, stock: number, category: string, image_url: string }): Promise<boolean> {
        try {
            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch(e) {
            console.error("Lỗi thêm SP backend", e);
            return false;
        }
    }

    static async xoaSanPham(id: number | string): Promise<boolean> {
        try {
            const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                method: 'DELETE'
            });
            return res.ok;
        } catch(e) {
            console.error("Lỗi xoá SP backend", e);
            return false;
        }
    }

    static async capNhatSanPham(id: number | string, data: any): Promise<boolean> {
        try {
            const realId = typeof id === 'string' ? id.replace('SP-', '') : id;
            const res = await fetch(`http://localhost:5000/api/products/${realId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res.ok;
        } catch(e) {
            console.error("Lỗi cập nhật SP backend", e);
            return false;
        }
    }
}

const API_BASE_URL = 'http://localhost:5000/api';

export const AuthService = {
    login: async (email: string, password: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (e) {
            return { success: false, error: 'Lỗi kết nối máy chủ' };
        }
    },

    register: async (email: string, password: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await response.json();
        } catch (e) {
            return { success: false, error: 'Lỗi kết nối máy chủ' };
        }
    },

    forgotPassword: async (email: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            return await response.json();
        } catch (e) {
            return { success: false, error: 'Lỗi kết nối máy chủ' };
        }
    },

    socialLogin: async (provider: 'google' | 'facebook' | 'apple', token: string): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/social-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider, token })
            });
            return await response.json();
        } catch (e) {
            return { success: false, error: 'Lỗi kết nối máy chủ' };
        }
    }
};