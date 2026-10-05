import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'CurrentPassword@123' })
    @IsNotEmpty({ message: 'Current password is required' })
    currentPassword: string;

    @ApiProperty({ example: 'NewPassword@123' })
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(8, { message: 'New password must be at least 8 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
        message: 'New password must include uppercase, lowercase, number, and special character',
    })
    newPassword: string;
}
