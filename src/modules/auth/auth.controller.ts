import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { CheckEmailDto } from './dto/check-email.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../common/interfaces/payload.interface.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    @Post('refresh-token')
    async refreshToken(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refreshToken);
    }
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        const result = await this.authService.signup(dto);
        return { message: result.message, payload: {} };
    }

    @Post('verify-otp')
    async verifyOTP(@Body() dto: VerifyOtpDto) {
        const result = await this.authService.verifyOTP(dto.email, dto.otp);
        return {
            message: result.message,
            payload: {
                verified: result.verified,
                user: 'user' in result ? result.user : null,
                accessToken: 'accessToken' in result ? result.accessToken : null,
                refreshToken: 'refreshToken' in result ? result.refreshToken : null,
            },
        };
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        const result = await this.authService.forgotPassword(dto.email);
        return { message: result.message, payload: {} };
    }

    @Post('resend-otp')
    async resendOTP(@Body() dto: ForgotPasswordDto) {
        const result = await this.authService.resendOTP(dto.email);
        return { message: result.message, payload: {} };
    }

    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        const result = await this.authService.resetPassword(dto.email, dto.otp, dto.password);
        return { message: result.message, payload: {} };
    }

    @Post('check-email')
    async checkEmail(@Body() dto: CheckEmailDto) {
        const payload = await this.authService.checkEmail(dto.email);
        return { message: 'Email checked successfully', payload };
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async changePassword(
        @CurrentUser() user: JwtPayload,
        @Body() dto: ChangePasswordDto,
    ) {
        const result = await this.authService.changePassword(
            user.userId,
            dto.currentPassword,
            dto.newPassword,
        );
        return { message: result.message, payload: {} };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async logout(@CurrentUser() user: JwtPayload) {
        const result = await this.authService.logout(user.userId);
        return { message: result.message, payload: {} };
    }

}