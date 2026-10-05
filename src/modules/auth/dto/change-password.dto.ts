import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'CurrentPassword@123' })
    @IsNotEmpty({ message: 'Current password is required' })
    currentPassword: string;

    @ApiProperty({ example: 'NewPassword@123' })
    @IsNotEmpty({ message: 'New password is required' })
    @MinLength(8, { message: 'New password must be at least 8 characters' })
    newPassword: string;
}
