const sql = require('mssql');

const config = {
    user: 'sa', // Thay bằng tài khoản SQL Server Admin của bạn
    password: 'Huyvinh123@', // Nhập đúng mật khẩu đăng nhập SSMS 
    server: 'DESKTOP-E8HFL02\\TTAM', // 'DESKTOP-E8HFL02\\TTAM' hoặc 'localhost'
    database: 'He_Thong_Thuong_Mai',
    options: {
        encrypt: false,
        trustServerCertificate: true // Rất quan trọng khi chạy local
    }
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('✅ Kết nối SQL Server thành công!');
        return pool;
    } catch (err) {
        console.error('❌ Kết nối SQL Server thất bại:', err);
    }
};

module.exports = {
    sql,
    connectDB
};
