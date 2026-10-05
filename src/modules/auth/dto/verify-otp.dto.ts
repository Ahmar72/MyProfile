import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty({ message: 'OTP is required' })
    @Length(6, 6, { message: 'OTP must be 6 digits' })
    otp: string;
}