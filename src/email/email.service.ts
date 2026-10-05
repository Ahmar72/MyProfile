import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private config: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.config.get('mail.host'),
            port: this.config.get('mail.port'),
            auth: {
                user: this.config.get('mail.user'),
                pass: this.config.get('mail.pass'),
            },
        });

        this.transporter.verify((error) => {
            if (error) console.error('❌ SMTP Error:', error.message);
            else console.log('✅ SMTP Server Ready');
        });
    }

    async sendWelcomeEmail(email: string, name: string) {
        return this.transporter.sendMail({
            from: `"Your App" <${this.config.get('mail.from')}>`,
            to: email,
            subject: 'Welcome to Our App!',
            text: `Hello ${name}, welcome to our platform!`,
            html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining us.</p>`,
        });
    }

    async sendOTPEmail(
        email: string,
        name: string,
        otp: string,
        purpose: 'signup' | 'reset-password' = 'signup',
    ) {
        const subject =
            purpose === 'signup' ? 'Verify your email' : 'Reset your password';
        const heading =
            purpose === 'signup' ? 'Verify Your Email' : 'Reset Your Password';

        return this.transporter.sendMail({
            from: `"Your App" <${this.config.get('mail.from')}>`,
            to: email,
            subject,
            text: `Hi ${name}, your OTP is: ${otp}. Expires in 10 minutes.`,
            html: `
                <h2>Hi ${name},</h2>
                <h3>${heading}</h3>
                <p>Your OTP is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>Expires in <strong>10 minutes</strong>.</p>
            `,
        });
    }
}