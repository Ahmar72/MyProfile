import {
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'Jane Doe' })
    @IsNotEmpty({ message: 'Name is required.' })
    @IsString()
    @MinLength(2, { message: 'Name must be at least 2 characters.' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters.' })
    name: string;

    @ApiProperty({ example: 'jane@example.com' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @ApiPropertyOptional({ example: '03001234567' })
    @IsOptional()
    @IsString()
    @Matches(/^(?:03\d{9}|\+923\d{9})$/, {
        message: 'Enter a valid Pakistani number (e.g. 03001234567).',
    })
    phone?: string;

    @ApiPropertyOptional({ enum: ['Admin', 'Editor', 'Viewer'], default: 'Viewer' })
    @IsOptional()
    @IsEnum(['Admin', 'Editor', 'Viewer'], {
        message: 'Role must be Admin, Editor, or Viewer',
    })
    role?: 'Admin' | 'Editor' | 'Viewer';

    @ApiPropertyOptional({ enum: ['Employee', 'Student', 'CEO'], default: 'Employee' })
    @IsOptional()
    @IsEnum(['Employee', 'Student', 'CEO'], {
        message: 'Profession must be Employee, Student, or CEO',
    })
    profession?: 'Employee' | 'Student' | 'CEO';

    @ApiPropertyOptional({ type: [String], example: ['coding', 'movies'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    hobbies?: string[];

    @ApiPropertyOptional({ example: 'Password@123', minLength: 8 })
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    password?: string;
}