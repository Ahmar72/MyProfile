import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { EmailService } from '../../email/email.service.js';
import { MESSAGES } from '../../common/constants/messages.js';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private emailService: EmailService,
    ) {}

    async getUsers(
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc',
        search?: string,
        verified?: boolean,
    ) {
        const skip = (page - 1) * limit;
        const sortField = sortBy === 'name' || sortBy === 'email' ? sortBy : 'createdAt';
        const sort: Record<string, 1 | -1> = {
            [sortField]: sortOrder === 'asc' ? 1 : -1,
        };
        const searchTerm = search?.trim();
        const filter: Record<string, unknown> = {};
        if (searchTerm) {
            filter.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { email: { $regex: searchTerm, $options: 'i' } },
            ];
        }
        if (verified !== undefined) {
            filter.isVerified = verified;
        }

        const [users, totalUsers] = await Promise.all([
            this.userModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
            this.userModel.countDocuments(filter).exec(),
        ]);

        return {
            users: users.map((u) => u.toJSON()),
            pagination: {
                page,
                limit,
                totalUsers,
                totalPages: Math.max(Math.ceil(totalUsers / limit), 1),
            },
        };
    }

    async createUser(dto: CreateUserDto) {
        const email = this.normalizeEmail(dto.email);
        const existing = await this.userModel.findOne({ email });
        if (existing) throw new ConflictException(MESSAGES.EMAIL_IN_USE);

        const hashedPassword = dto.password
            ? await bcrypt.hash(dto.password, 10)
            : undefined;

        const user = await this.userModel.create({
            name: dto.name,
            email,
            phone: dto.phone,
            role: dto.role ?? 'Viewer',
            profession: dto.profession ?? 'Employee',
            hobbies: dto.hobbies ?? [],
            password: hashedPassword,
            isVerified: true, // admin-created
        });

        this.emailService
            .sendWelcomeEmail(user.email, user.name)
            .catch((err) => console.error('Welcome email failed:', err));

        return user.toJSON();
    }

    async getUserById(id: string) {
        this.ensureValidId(id);
        const user = await this.userModel.findById(id);
        if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        return user.toJSON();
    }

    async getMe(userId: string) {
        this.ensureValidId(userId);
        const user = await this.userModel.findById(userId);
        if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        return user.toJSON();
    }

    async updateUser(id: string, dto: UpdateUserDto) {
        this.ensureValidId(id);
        const updateData: Partial<User> = { ...dto };

        if (dto.email) {
            updateData.email = this.normalizeEmail(dto.email);
        }

        if (dto.password) {
            updateData.password = await bcrypt.hash(dto.password, 10);
        }

        const user = await this.userModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        return user.toJSON();
    }

    async deleteUser(id: string) {
        this.ensureValidId(id);
        const user = await this.userModel.findByIdAndDelete(id);
        if (!user) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
        return user.toJSON();
    }

    private ensureValidId(id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid user id');
        }
    }

    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }
}