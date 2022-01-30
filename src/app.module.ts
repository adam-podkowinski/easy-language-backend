import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_TYPE: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        TYPEORM_SYNC: Joi.bool().required(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
