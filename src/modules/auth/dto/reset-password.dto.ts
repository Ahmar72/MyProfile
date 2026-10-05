import { IsEmail, IsNotEmpty, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty({ message: 'OTP is required' })
    @Length(6, 6, { message: 'OTP must be 6 digits' })
    otp: string;

    @ApiProperty({ example: 'NewPassword@123' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password: string;
}