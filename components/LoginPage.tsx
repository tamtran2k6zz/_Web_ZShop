import React, { useState } from 'react';
import { User, Lock, ArrowLeft, HelpCircle, Eye, EyeOff, ShoppingBag } from 'lucide-react';

import { AuthService } from '../services';

interface LoginPageProps {
  onLoginSuccess: (role: 'CUSTOMER' | 'ADMIN' | 'SELLER') => void;
  onBack: () => void;
  onGoToRegister: () => void;
  onGoToForgotPassword: () => void;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.52 12.29C23.52 11.43 23.44 10.61 23.3 9.82H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.94 21.1C22.2 19.01 23.52 15.92 23.52 12.29Z" fill="#4285F4"/>
    <path d="M12 24C15.24 24 17.96 22.92 19.94 21.1L16.08 18.1C15 18.82 13.62 19.24 12 19.24C8.87 19.24 6.22 17.13 5.27 14.29L1.29 17.38C3.26 21.3 7.31 24 12 24Z" fill="#34A853"/>
    <path d="M5.27 14.29C5.03 13.57 4.9 12.8 4.9 12C4.9 11.2 4.77 10.43 5.53 9.71L1.29 6.62C0.47 8.24 0 10.06 0 12C0 13.94 0.47 15.76 1.29 17.38L5.27 14.29Z" fill="#FBBC05"/>
    <path d="M12 4.76C13.76 4.76 15.35 5.37 16.59 6.56L20.03 3.12C17.96 1.18 15.24 0 12 0C7.31 0 3.26 2.7 1.29 6.62L5.53 9.71C6.22 6.87 8.87 4.76 12 4.76Z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12C24 5.373 18.627 0 12 0C5.373 0 0 5.373 0 12C0 17.989 4.388 22.954 10.125 23.854V15.469H7.078V12H10.125V9.356C10.125 6.349 11.916 4.688 14.658 4.688C15.97 4.688 17.344 4.922 17.344 4.922V7.875H15.831C14.34 7.875 13.875 8.794 13.875 9.738V12H17.203L16.671 15.469H13.875V23.854C19.612 22.954 24 17.989 24 12Z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/>
  </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBack, onGoToRegister, onGoToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SOCIAL_CONFIG = {
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined,
    facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined,
    appleClientId: import.meta.env.VITE_APPLE_CLIENT_ID as string | undefined,
    appleRedirectUri: import.meta.env.VITE_APPLE_REDIRECT_URI as string | undefined
  };

  const loadScript = (id: string, src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById(id);
      if (existing) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Không tải được script: ${src}`));
      document.body.appendChild(script);
    });
  };

  const handleSocialTokenLogin = async (provider: 'google' | 'facebook' | 'apple', token: string) => {
    const data = await AuthService.socialLogin(provider, token);
    if (!data.success) {
      setErrorMsg(data.error || 'Đăng nhập social thất bại.');
      return;
    }
    onLoginSuccess(data.role as 'CUSTOMER' | 'ADMIN' | 'SELLER');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
        const data = await AuthService.login(email, password);
        if (data.success) {
            onLoginSuccess(data.role as 'CUSTOMER' | 'ADMIN' | 'SELLER');
        } else {
            setErrorMsg(data.error || 'Đăng nhập thất bại.');
        }
    } catch (error) {
        setErrorMsg('Lỗi kết nối đến máy chủ.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!SOCIAL_CONFIG.googleClientId) {
        setErrorMsg('Thiếu VITE_GOOGLE_CLIENT_ID');
        return;
      }
      setErrorMsg('');
      setIsLoading(true);
      await loadScript('google-identity-sdk', 'https://accounts.google.com/gsi/client');

      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        throw new Error('Google SDK chưa sẵn sàng');
      }

      const token = await new Promise<string>((resolve, reject) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: SOCIAL_CONFIG.googleClientId,
          scope: 'openid email profile',
          ux_mode: 'popup',
          redirect_uri: window.location.origin,
          callback: (response: any) => {
            if (response?.access_token) {
              resolve(response.access_token);
              return;
            }
            reject(new Error('Không nhận được Google access token'));
          },
          error_callback: (error: any) => {
            reject(new Error(error?.message || 'Đăng nhập Google bị từ chối'));
          },
        });
        tokenClient.requestAccessToken();
      });

      await handleSocialTokenLogin('google', token);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      if (!SOCIAL_CONFIG.facebookAppId) {
        setErrorMsg('Thiếu VITE_FACEBOOK_APP_ID');
        return;
      }
      setErrorMsg('');
      setIsLoading(true);

      await loadScript('facebook-sdk', 'https://connect.facebook.net/en_US/sdk.js');
      const FB = (window as any).FB;
      if (!FB) {
        throw new Error('Facebook SDK chưa sẵn sàng');
      }

      await new Promise<void>((resolve) => {
        FB.init({
          appId: SOCIAL_CONFIG.facebookAppId,
          cookie: true,
          xfbml: false,
          version: 'v22.0'
        });
        resolve();
      });

      const token = await new Promise<string>((resolve, reject) => {
        FB.login((response: any) => {
          const accessToken = response?.authResponse?.accessToken;
          if (accessToken) {
            resolve(accessToken);
            return;
          }
          reject(new Error('Không lấy được Facebook access token'));
        }, { scope: 'public_profile,email' });
      });

      await handleSocialTokenLogin('facebook', token);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Đăng nhập Facebook thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      if (!SOCIAL_CONFIG.appleClientId || !SOCIAL_CONFIG.appleRedirectUri) {
        setErrorMsg('Thiếu VITE_APPLE_CLIENT_ID hoặc VITE_APPLE_REDIRECT_URI');
        return;
      }
      setErrorMsg('');
      setIsLoading(true);

      await loadScript('apple-sdk', 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js');
      const AppleID = (window as any).AppleID;
      if (!AppleID?.auth) {
        throw new Error('Apple SDK chưa sẵn sàng');
      }

      AppleID.auth.init({
        clientId: SOCIAL_CONFIG.appleClientId,
        scope: 'name email',
        redirectURI: SOCIAL_CONFIG.appleRedirectUri,
        usePopup: true
      });

      const response = await AppleID.auth.signIn();
      const idToken = response?.authorization?.id_token;
      if (!idToken) {
        throw new Error('Không lấy được Apple ID token');
      }

      await handleSocialTokenLogin('apple', idToken);
    } catch (error: any) {
      setErrorMsg(error?.message || 'Đăng nhập Apple thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in font-sans">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-10">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2">
                <ArrowLeft size={24}/>
            </button>
            <div className="text-xl font-medium text-gray-800">Đăng nhập</div>
            <button className="text-red-500 hover:text-red-600 transition-colors p-2 -mr-2">
                <HelpCircle size={24}/>
            </button>
        </div>

        <div className="flex-1 px-6 pt-10 pb-6 flex flex-col max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-10">
                <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 text-white mb-4">
                    <ShoppingBag size={32} />
                </div>
                <h2 className="text-brand-600 font-bold text-2xl tracking-tight">SZSHOP</h2>
                <p className="text-gray-500 text-sm mt-2 font-medium text-center">Đăng nhập để mua sắm nhanh chóng & tiện lợi</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    {/* User Input */}
                    <div className="relative group">
                        <div className="absolute left-0 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                            <User size={22} />
                        </div>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email/Số điện thoại/Tên đăng nhập"
                            className="w-full pl-9 pr-4 py-2.5 border-b border-gray-300 outline-none text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-600 transition-colors bg-transparent font-medium"
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div className="relative group">
                         <div className="absolute left-0 top-3 text-gray-400 group-focus-within:text-brand-600 transition-colors">
                            <Lock size={22} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className="w-full pl-9 pr-24 py-2.5 border-b border-gray-300 outline-none text-base text-gray-900 placeholder:text-gray-400 focus:border-brand-600 transition-colors bg-transparent font-medium"
                        />
                        <div className="absolute right-0 top-3 flex items-center gap-3">
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                            <div className="w-px h-5 bg-gray-300"></div>
                            <button type="button" onClick={onGoToForgotPassword} className="text-blue-600 font-medium text-sm whitespace-nowrap hover:text-blue-800">
                                Quên?
                            </button>
                        </div>
                    </div>
                </div>

                {errorMsg && (
                    <div className="text-red-500 text-sm font-medium text-center">
                        {errorMsg}
                    </div>
                )}

                <div className="pt-2">
                    <button 
                        type="submit"
                        disabled={!email || !password || isLoading}
                        className={`w-full py-3 rounded-sm text-white font-medium text-base transition-all shadow-md flex items-center justify-center gap-2
                            ${email && password && !isLoading ? 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg' : 'bg-gray-300 cursor-not-allowed'}
                        `}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                    
                    <div className="flex justify-between items-center text-sm mt-4">
                        <div /> {/* Spacer */}
                        <button type="button" className="text-blue-600 hover:text-blue-800">
                            Đăng nhập bằng SMS
                        </button>
                    </div>
                </div>
            </form>

            {/* Separator */}
            <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-gray-400 text-sm uppercase">Hoặc</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Socials */}
            <div className="space-y-3">
                <button type="button" disabled={isLoading} onClick={handleGoogleLogin} className="w-full border border-gray-300 rounded py-2.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-60">
                   <GoogleIcon />
                   <span className="text-sm text-gray-700 font-medium">Tiếp tục với Google</span>
                </button>
                <button type="button" disabled={isLoading} onClick={handleFacebookLogin} className="w-full border border-gray-300 rounded py-2.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-60">
                   <FacebookIcon />
                   <span className="text-sm text-gray-700 font-medium">Tiếp tục với Facebook</span>
                </button>
                <button type="button" disabled={isLoading} onClick={handleAppleLogin} className="w-full border border-gray-300 rounded py-2.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-60">
                   <AppleIcon />
                   <span className="text-sm text-gray-700 font-medium">Tiếp tục với Apple</span>
                </button>
            </div>

            <div className="mt-auto pt-8 text-center text-sm">
                <span className="text-gray-500">Bạn chưa có tài khoản? </span>
                <button onClick={onGoToRegister} className="text-blue-600 font-medium hover:underline">Đăng ký ngay</button>
            </div>
            
            <div className="text-center mt-6">
                 <p className="text-xs text-gray-400">Gợi ý: Nhập email chứa "admin" để vào trang quản trị.</p>
                 <p className="text-xs text-gray-400 mt-1">Hoặc chứa "seller" để vào Kênh Người Bán.</p>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;