export const generateOTP = (): string =>
    Math.floor(100000 + Math.random() * 900000).toString();

export const getOTPExpiry = (minutes = 10): Date =>
    new Date(Date.now() + minutes * 60 * 1000);