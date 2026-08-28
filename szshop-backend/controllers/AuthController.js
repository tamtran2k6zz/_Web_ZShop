const UserRepository = require('../repositories/UserRepository');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const appleSigninAuth = require('apple-signin-auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

const SOCIAL_PROVIDER = {
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
    APPLE: 'apple'
};

class AuthController {
    mapRole(roleId, email) {
        // DB Roles table (per current migration/data):
        // 1 = ADMIN, 2 = SELLER, 3 = CUSTOMER
        let role = 'CUSTOMER';
        if (roleId === 1) role = 'ADMIN';
        if (roleId === 2) role = 'SELLER';
        if (roleId === 3) role = 'CUSTOMER';

        // Keep email-based overrides for demo convenience, but DB role_id is the source of truth.
        if (email && email.toLowerCase().includes('seller')) role = 'SELLER';
        if (email && email.toLowerCase().includes('admin')) role = 'ADMIN';

        return role;
    }

    createSessionToken(user, role) {
        const secret = process.env.JWT_SECRET || 'dev-jwt-secret';
        return jwt.sign(
            { sub: user.id, email: user.email, role },
            secret,
            { expiresIn: '7d' }
        );
    }

    async verifyGoogleToken(idToken) {
        if (process.env.GOOGLE_CLIENT_ID) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken,
                    audience: process.env.GOOGLE_CLIENT_ID
                });
                const payload = ticket.getPayload();
                if (payload && payload.sub) {
                    return {
                        provider: SOCIAL_PROVIDER.GOOGLE,
                        providerUserId: payload.sub,
                        email: payload.email || null
                    };
                }
            } catch (_) {
                // Fallback to Google userinfo when frontend sends access_token.
            }
        }

        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(idToken)}`);
        const data = await response.json();
        if (!response.ok || !data.sub) {
            throw new Error('Google token không hợp lệ');
        }
        return {
            provider: SOCIAL_PROVIDER.GOOGLE,
            providerUserId: data.sub,
            email: data.email || null
        };
    }

    async verifyFacebookToken(accessToken) {
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(accessToken)}`);
        const data = await response.json();
        if (!response.ok || !data.id) {
            throw new Error('Facebook token không hợp lệ');
        }
        return {
            provider: SOCIAL_PROVIDER.FACEBOOK,
            providerUserId: data.id,
            email: data.email || null
        };
    }

    async verifyAppleToken(identityToken) {
        if (!process.env.APPLE_CLIENT_ID) {
            throw new Error('APPLE_CLIENT_ID chưa được cấu hình');
        }

        const claims = await appleSigninAuth.verifyIdToken(identityToken, {
            audience: process.env.APPLE_CLIENT_ID,
            ignoreExpiration: false
        });
        if (!claims || !claims.sub) {
            throw new Error('Apple token không hợp lệ');
        }

        return {
            provider: SOCIAL_PROVIDER.APPLE,
            providerUserId: claims.sub,
            email: claims.email || null
        };
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Vui lòng nhập định dạng email và mật khẩu' });
            }

            // Find user
            const user = await UserRepository.findByEmail(email);
            if (!user) {
                return res.status(401).json({ success: false, error: 'Sai tài khoản hoặc mật khẩu' });
            }

            // Since it's demo, we check password plain text
            if (user.password !== password) {
                return res.status(401).json({ success: false, error: 'Sai mật khẩu' });
            }

            // Map role_id to string representations for frontend
            // DB Roles table: 1=ADMIN, 2=SELLER, 3=CUSTOMER
            let role = 'CUSTOMER';
            if (user.role_id === 1) role = 'ADMIN';
            if (user.role_id === 2) role = 'SELLER';
            if (user.role_id === 3) role = 'CUSTOMER';
            
            // Allow override via email text logic if needed, but DB truth is better
            if (email.toLowerCase().includes('seller')) {
                 role = 'SELLER';
            }
            if (email.toLowerCase().includes('admin')) {
                 role = 'ADMIN';
            }

            res.json({ success: true, role, user: { id: user.id, email: user.email }});
            
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, error: 'Lỗi server' });
        }
    }

    async register(req, res) {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ success: false, error: 'Vui lòng điền đủ thông tin' });
            }

            // Check if exist
            const exist = await UserRepository.findByEmail(email);
            if (exist) {
                return res.status(400).json({ success: false, error: 'Email này đã được sử dụng' });
            }

            // Determine role by text for demo purposes
            let role_id = 3; // Default CUSTOMER (DB: 3=CUSTOMER)
            if (email.toLowerCase().includes('admin')) role_id = 1;
            else if (email.toLowerCase().includes('seller')) role_id = 2;

            const newUserId = await UserRepository.createUser(email, password, role_id);
            res.json({ success: true, id: newUserId });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ success: false, error: 'Lỗi khi tạo tài khoản' });
        }
    }

    async forgotPassword(req, res) {
        // Just mock success since no mail server
        try {
            const { email } = req.body;
            const exist = await UserRepository.findByEmail(email);
            if (!exist) {
                return res.status(400).json({ success: false, error: 'Email không tồn tại trong hệ thống' });
            }
            res.json({ success: true, message: 'Đường dẫn lấy lại mật khẩu đã được gửi qua email!' });
        } catch(e) {
            res.status(500).json({ success: false, error: 'Lỗi server' });
        }
    }

    async socialLogin(req, res) {
        try {
            const { provider, token } = req.body;
            if (!provider || !token) {
                return res.status(400).json({ success: false, error: 'Thiếu provider hoặc token' });
            }

            let profile;
            if (provider === SOCIAL_PROVIDER.GOOGLE) {
                profile = await this.verifyGoogleToken(token);
            } else if (provider === SOCIAL_PROVIDER.FACEBOOK) {
                profile = await this.verifyFacebookToken(token);
            } else if (provider === SOCIAL_PROVIDER.APPLE) {
                profile = await this.verifyAppleToken(token);
            } else {
                return res.status(400).json({ success: false, error: 'Provider không được hỗ trợ' });
            }

            const user = await UserRepository.findOrCreateSocialUser(profile);
            const role = this.mapRole(user.role_id, user.email);
            const sessionToken = this.createSessionToken(user, role);

            return res.json({
                success: true,
                role,
                token: sessionToken,
                user: { id: user.id, email: user.email }
            });
        } catch (error) {
            console.error('Social login error:', error);
            return res.status(401).json({ success: false, error: error.message || 'Đăng nhập social thất bại' });
        }
    }
}

module.exports = new AuthController();
