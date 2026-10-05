import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../common/interfaces/payload.interface.js';
import { MESSAGES } from '../../common/constants/messages.js';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @ApiOkResponse({ description: 'Current user returned' })
    async getMe(@CurrentUser() user: JwtPayload) {
        const payload = await this.userService.getMe(user.userId);
        return { message: MESSAGES.USER_FETCHED, payload };
    }

    @Get()
    @ApiQuery({ name: 'page', required: false, example: 1, type: Number })
    @ApiQuery({ name: 'limit', required: false, example: 10, type: Number })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['createdAt', 'name', 'email'], example: 'createdAt' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], example: 'desc' })
    @ApiQuery({ name: 'search', required: false, example: 'jane' })
    @ApiQuery({ name: 'verified', required: false, enum: ['true', 'false'], example: 'true' })
    @ApiOkResponse({ description: 'Paginated users returned' })
    async getUsers(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('sortBy') sortBy?: string,
        @Query('sortOrder') sortOrder?: string,
        @Query('search') search?: string,
        @Query('verified') verified?: string,
    ) {
        const p = Math.max(parseInt(page || '1', 10), 1);
        const l = Math.min(Math.max(parseInt(limit || '10', 10), 1), 100);
        const sortField = ['createdAt', 'name', 'email'].includes(sortBy ?? '') ? sortBy : 'createdAt';
        const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc';
        const verifiedFilter =
            verified === 'true' ? true : verified === 'false' ? false : undefined;

        const payload = await this.userService.getUsers(
            p,
            l,
            sortField,
            sortDirection,
            search,
            verifiedFilter,
        );
        return { message: MESSAGES.USERS_FETCHED, payload };
    }

    @Post()
    @ApiCreatedResponse({ description: 'User created successfully' })
    async createUser(@Body() dto: CreateUserDto) {
        const payload = await this.userService.createUser(dto);
        return { message: MESSAGES.USER_CREATED, payload };
    }

    @Get(':id')
    @ApiParam({ name: 'id', example: '65f1c2e8a5d1f0a123456789' })
    @ApiOkResponse({ description: 'User returned' })
    async getUserById(@Param('id') id: string) {
        const payload = await this.userService.getUserById(id);
        return { message: MESSAGES.USER_FETCHED, payload };
    }

    @Put(':id')
    @ApiParam({ name: 'id', example: '65f1c2e8a5d1f0a123456789' })
    @ApiOkResponse({ description: 'User updated successfully' })
    async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const payload = await this.userService.updateUser(id, dto);
        return { message: MESSAGES.USER_UPDATED, payload };
    }

    @Delete(':id')
    @ApiParam({ name: 'id', example: '65f1c2e8a5d1f0a123456789' })
    @ApiOkResponse({ description: 'User deleted successfully' })
    async deleteUser(@Param('id') id: string) {
        const payload = await this.userService.deleteUser(id);
        return { message: MESSAGES.USER_DELETED, payload };
    }
}