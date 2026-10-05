import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import configuration from './config/configuration.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/user/user.module.js';
import { EmailModule } from './email/email.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        DatabaseModule,
        AuthModule,
        UserModule,
        EmailModule,
    ],
    providers: [
        { provide: APP_FILTER, useClass: AllExceptionsFilter },
        { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    ],
})
export class AppModule {}