export default () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
    },
    mail: {
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT ?? '2525', 10),
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
        from: process.env.MAIL_FROM,
    },
    otp: {
        expiresMinutes: parseInt(process.env.OTP_EXPIRES_MINUTES ?? '10', 10),
    },
});