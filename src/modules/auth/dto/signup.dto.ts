import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
    @ApiProperty({ example: 'Jane Doe' })
    @IsNotEmpty({ message: 'Name is required' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @ApiProperty({ example: 'jane@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiProperty({ example: 'Password@123' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'Password must include uppercase, lowercase, number, and special character',
    })
    password: string;
}