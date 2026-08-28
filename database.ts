import { ProductDetail, Order, TrackingStep, OrderStatus } from './types.ts';
import { MOCK_PRODUCTS_LIST } from './constants.ts';

export class HeThongBanHangDB {
    static getSanPhamById(id: string): ProductDetail {
        return MOCK_PRODUCTS_LIST.find(p => p.id === id) || MOCK_PRODUCTS_LIST[0];
    }

    static getAllSanPham(): ProductDetail[] {
        return MOCK_PRODUCTS_LIST;
    }

    static searchSanPham(tuKhoa: string): ProductDetail[] {
        const lowerKeyword = tuKhoa.toLowerCase();
        return MOCK_PRODUCTS_LIST.filter(p => 
            p.name.toLowerCase().includes(lowerKeyword) || 
            (p.category && p.category.toLowerCase().includes(lowerKeyword))
        );
    }

    static saveDonHang(newOrder: Order): void {
        console.log("DB Mock: Saved Order", newOrder.id);
    }

    static getLichSuDonHang(keyword: string): TrackingStep[] | null {
        if (!keyword || keyword.trim() === '') return null;
        
        return [
            {
                status: OrderStatus.PENDING,
                date: new Date(Date.now() - 86400000).toISOString(),
                description: 'Đơn hàng đã được tạo',
                completed: true
            },
            {
                status: OrderStatus.PAID,
                date: new Date(Date.now() - 43200000).toISOString(),
                description: 'Đã thanh toán thành công',
                completed: true
            },
            {
                status: OrderStatus.PROCESSING,
                date: new Date(Date.now() - 3600000).toISOString(),
                description: 'Đang chuẩn bị hàng',
                completed: true
            },
            {
                status: OrderStatus.SHIPPING,
                date: new Date().toISOString(),
                description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
                completed: false
            }
        ];
    }

    static updateTrangThaiDonHang(orderId: string, status: OrderStatus): void {
        console.log(`DB Mock: Updated Order ${orderId} status to ${status}`);
    }
}
