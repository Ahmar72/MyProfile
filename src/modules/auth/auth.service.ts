import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { User } from '../user/schemas/user.schema.js';
import { EmailService } from '../../email/email.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { generateOTP, getOTPExpiry } from '../../utils/otp.util.js';
import { MESSAGES } from '../../common/constants/messages.js';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwt: JwtService,
        private config: ConfigService,
        private emailService: EmailService,
    ) {}

    // ============ SIGNUP ============
    async signup(dto: SignupDto) {
        const email = this.normalizeEmail(dto.email);
        const existing = await this.userModel.findOne({ email });

        if (existing && existing.isVerified) {
            throw new ConflictException(MESSAGES.EMAIL_IN_USE);
        }

        const hashed = await bcrypt.hash(dto.password, 10);
        const otp = generateOTP();
        const otpExpiresAt = getOTPExpiry(this.config.get('otp.expiresMinutes'));

        let user;
        if (existing) {
            existing.name = dto.name;
            existing.password = hashed;
            existing.otp = otp;
            existing.otpExpiresAt = otpExpiresAt;
            user = await existing.save();
        } else {
            user = await this.userModel.create({
                name: dto.name,
                email,
                password: hashed,
                otp,
                otpExpiresAt,
                isVerified: false,
            });
        }

        console.log(`🔐 Signup OTP for ${user.email}: ${otp}`);
        await this.emailService.sendOTPEmail(user.email, user.name, otp, 'signup');

        return { message: MESSAGES.SIGNUP_SUCCESS };
    }

    // ============ VERIFY OTP ============
    async verifyOTP(email: string, otp: string) {
        const user = await this.userModel
            .findOne({ email: this.normalizeEmail(email) })
            .select('+otp +otpExpiresAt');

        if (!user || !user.otp || !user.otpExpiresAt) {
            throw new BadRequestException(MESSAGES.OTP_INVALID);
        }

        if (user.otp !== otp) {
            throw new BadRequestException(MESSAGES.OTP_INVALID);
        }

        if (user.otpExpiresAt < new Date()) {
            throw new BadRequestException(MESSAGES.OTP_EXPIRED);
        }

        // If first-time verification → auto-login
        if (!user.isVerified) {
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiresAt = undefined;
            await user.save();

            this.emailService
                .sendWelcomeEmail(user.email, user.name)
                .catch((err) => console.error('Welcome email failed:', err));

            const tokens = await this.generateTokens(user);

            return {
                message: 'Email verified successfully',
                verified: true,
                user: user.toJSON(),
                ...tokens,
            };
        }

        return {
            message: MESSAGES.OTP_VERIFIED,
            verified: false,
        };
    }

    // ============ LOGIN ============
    async login(dto: LoginDto) {
        const user = await this.userModel
            .findOne({ email: this.normalizeEmail(dto.email) })
            .select('+password');

        if (!user) throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);

        if (!user.isVerified) {
            throw new ForbiddenException(MESSAGES.EMAIL_NOT_VERIFIED);
        }

        if (!user.password) {
            throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
        }

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);

        const tokens = await this.generateTokens(user);

        return {
            message: MESSAGES.LOGIN_SUCCESS,
            payload: {
                user: user.toJSON(),
                ...tokens,
            },
        };
    }

    // ============ FORGOT PASSWORD ============
    async forgotPassword(email: string) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return { message: 'If the email exists, an OTP has been sent' };
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiresAt = getOTPExpiry(this.config.get('otp.expiresMinutes'));
        await user.save();

        console.log(`🔐 Reset OTP for ${user.email}: ${otp}`);
        await this.emailService.sendOTPEmail(
            user.email,
            user.name,
            otp,
            user.isVerified ? 'reset-password' : 'signup',
        );

        return { message: MESSAGES.OTP_SENT };
    }

    // ============ RESEND OTP ============
    async resendOTP(email: string) {
        const user = await this.userModel.findOne({
            email: this.normalizeEmail(email),
        });
        if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiresAt = getOTPExpiry(this.config.get('otp.expiresMinutes'));
        await user.save();

        console.log(`🔐 New OTP for ${email}: ${otp}`);
        const purpose = user.isVerified ? 'reset-password' : 'signup';
        await this.emailService.sendOTPEmail(user.email, user.name, otp, purpose);

        return { message: 'OTP resent successfully' };
    }

    // ============ RESET PASSWORD ============
    async resetPassword(email: string, otp: string, password: string) {
        const user = await this.userModel
            .findOne({ email: this.normalizeEmail(email) })
            .select('+otp +otpExpiresAt');

        if (!user || !user.otp || !user.otpExpiresAt) {
            throw new BadRequestException(MESSAGES.OTP_INVALID);
        }

        if (user.otp !== otp) {
            throw new BadRequestException(MESSAGES.OTP_INVALID);
        }

        if (user.otpExpiresAt < new Date()) {
            throw new BadRequestException(MESSAGES.OTP_EXPIRED);
        }

        user.password = await bcrypt.hash(password, 10);
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        return { message: MESSAGES.PASSWORD_RESET };
    }

    // ============ CHECK EMAIL ============
    async checkEmail(email: string) {
        const user = await this.userModel.findOne({
            email: this.normalizeEmail(email),
        });

        if (!user) {
            return { exists: false, isVerified: false, nextStep: 'signup' };
        }

        return {
            exists: true,
            isVerified: user.isVerified,
            nextStep: user.isVerified ? 'login' : 'verify-otp',
        };
    }

    // ============ CHANGE PASSWORD ============
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string,
    ) {
        const user = await this.userModel.findById(userId).select('+password');

        if (!user || !user.password) {
            throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        }

        const matches = await bcrypt.compare(currentPassword, user.password);
        if (!matches) {
            throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            throw new BadRequestException(
                'New password must be different from the current password',
            );
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.refreshToken = undefined;
        await user.save();

        return { message: 'Password changed successfully' };
    }

    // ============ REFRESH TOKEN ============
    async refreshToken(refreshToken: string) {
        try {
            const payload = await this.jwt.verifyAsync(refreshToken, {
                secret: this.config.get('jwt.refreshSecret'),
            });

            const userWithToken = await this.userModel
                .findById(payload.userId)
                .select('+refreshToken');

            if (!userWithToken || userWithToken.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Refresh token has been revoked');
            }

            const user = await this.userModel.findById(payload.userId);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            if (!user.isVerified) {
                throw new ForbiddenException(MESSAGES.EMAIL_NOT_VERIFIED);
            }

            const tokens = await this.generateTokens(user);

            return {
                message: 'Tokens refreshed successfully',
                payload: tokens,
            };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }


    // ============ LOGOUT ============
async logout(userId: string) {
    const user = await this.userModel.findById(userId).select('+refreshToken');
    if (!user) {
        throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
    }

    // Clear the refresh token
    user.refreshToken = undefined;
    await user.save();

    return { message: 'Logged out successfully' };
}

    // ============ PRIVATE: GENERATE TOKENS ============
    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    private async generateTokens(user: HydratedDocument<User>) {
    const payload = { userId: user._id.toString(), email: user.email };

    const accessToken = await this.jwt.signAsync(payload, {
        secret: this.config.get('jwt.secret'),
        expiresIn: this.config.get('jwt.accessExpires'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
        secret: this.config.get('jwt.refreshSecret'),
        expiresIn: this.config.get('jwt.refreshExpires'),
    });

    // Save the refresh token for logout support
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
}
}