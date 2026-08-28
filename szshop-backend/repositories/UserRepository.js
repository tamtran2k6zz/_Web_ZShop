const { connectDB } = require('../db.config');

class UserRepository {
    async getAllUsers() {
        const pool = await connectDB();
        const result = await pool.request().query('SELECT * FROM Users');
        return result.recordset;
    }

    async findByEmail(email) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', email)
            .query('SELECT * FROM Users WHERE email = @email');
        return result.recordset[0];
    }

    async findByProviderUserId(provider, providerUserId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('provider', provider)
            .input('provider_user_id', providerUserId)
            .query(`
                SELECT * FROM Users
                WHERE provider = @provider AND provider_user_id = @provider_user_id
            `);
        return result.recordset[0];
    }

    async createUser(email, password, role_id) {
        const pool = await connectDB();
        // Insert and return the newly created user ID
        const result = await pool.request()
            .input('email', email)
            .input('password', password)
            .input('role_id', role_id)
            .query(`
                INSERT INTO Users (email, password, role_id) 
                VALUES (@email, @password, @role_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }

    async findOrCreateSocialUser({ email, provider, providerUserId }) {
        const existingByProvider = await this.findByProviderUserId(provider, providerUserId);
        if (existingByProvider) {
            return existingByProvider;
        }

        const safeEmail = email || `${providerUserId}@${provider}.local`;
        const existing = await this.findByEmail(safeEmail);
        if (existing) {
            // Backfill provider metadata for existing account when available.
            await this.attachProviderToUser(existing.id, provider, providerUserId);
            existing.provider = provider;
            existing.provider_user_id = providerUserId;
            return existing;
        }

        // Store a random placeholder password for social-only accounts
        // because the current Users schema requires password.
        const randomPassword = `SOCIAL_${provider}_${providerUserId}_${Date.now()}`;
        const roleId = 2;
        const newId = await this.createSocialUser(safeEmail, randomPassword, roleId, provider, providerUserId);
        return {
            id: newId,
            email: safeEmail,
            role_id: roleId,
            provider,
            provider_user_id: providerUserId
        };
    }

    async attachProviderToUser(userId, provider, providerUserId) {
        const pool = await connectDB();
        await pool.request()
            .input('id', userId)
            .input('provider', provider)
            .input('provider_user_id', providerUserId)
            .query(`
                UPDATE Users
                SET provider = @provider, provider_user_id = @provider_user_id
                WHERE id = @id
            `);
    }

    async createSocialUser(email, password, role_id, provider, providerUserId) {
        const pool = await connectDB();
        const result = await pool.request()
            .input('email', email)
            .input('password', password)
            .input('role_id', role_id)
            .input('provider', provider)
            .input('provider_user_id', providerUserId)
            .query(`
                INSERT INTO Users (email, password, role_id, provider, provider_user_id) 
                VALUES (@email, @password, @role_id, @provider, @provider_user_id);
                SELECT SCOPE_IDENTITY() AS id;
            `);
        return result.recordset[0].id;
    }
}

module.exports = new UserRepository();
