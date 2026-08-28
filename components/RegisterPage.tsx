import React, { useState } from 'react';
import { User, Lock, ArrowLeft, Mail, ShoppingBag } from 'lucide-react';

import { AuthService } from '../services';

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onBack: () => void;
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess, onBack, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        const response = await AuthService.register(email, password);
        if (response.success) {
            onRegisterSuccess();
        } else {
            setErrorMsg(response.error || 'Lỗi đăng ký.');
        }
    } catch (err) {
        setErrorMsg('Lỗi kết nối máy chủ.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in font-sans">
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2">
                <ArrowLeft size={24}/>
            </button>
            <div className="text-xl font-medium text-gray-800">Đăng ký</div>
            <div className="w-8"></div>
        </div>

        <div className="flex-1 px-6 pt-10 pb-6 flex flex-col max-w-md mx-auto w-full">
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 text-white mb-4">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-brand-600 font-bold text-2xl tracking-tight">ZS-Economy</h2>
                <p className="text-gray-500 text-sm mt-2 font-medium text-center">Tạo tài khoản mới</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <div className="relative group">
                        <div className="absolute left-0 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                            <User size={22} />
                        </div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Họ và tên"
                            className="w-full pl-9 pr-4 py-2.5 border-b border-gray-300 outline-none text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-600 transition-colors bg-transparent font-medium"
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute left-0 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                            <Mail size={22} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full pl-9 pr-4 py-2.5 border-b border-gray-300 outline-none text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-600 transition-colors bg-transparent font-medium"
                        />
                    </div>
                    <div className="relative group">
                         <div className="absolute left-0 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                            <Lock size={22} />
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className="w-full pl-9 pr-4 py-2.5 border-b border-gray-300 outline-none text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-600 transition-colors bg-transparent font-medium"
                        />
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-red-500 text-sm font-medium text-center">
                        {errorMsg}
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={!email || !password || !name || isLoading}
                        className={`w-full py-3 rounded-sm text-white font-medium text-base transition-all shadow-md
                            ${email && password && name && !isLoading ? 'bg-brand-600 hover:bg-brand-700' : 'bg-gray-300 cursor-not-allowed'}
                        `}
                    >
                        {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
                    </button>
                </div>
            </form>

            <div className="mt-auto pt-8 text-center text-sm">
                <span className="text-gray-500">Đã có tài khoản? </span>
                <button onClick={onGoToLogin} className="text-brand-600 font-medium hover:underline">Đăng nhập ngay</button>
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;
