import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { User, UserSchema } from './schemas/user.schema.js';
import { EmailModule } from '../../email/email.module.js';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        EmailModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, MongooseModule],
})
export class UserModule {}