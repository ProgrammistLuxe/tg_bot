import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from '../config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectModule } from '@api/subject/subject.module';
const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/env/${process.env.NODE_ENV}.env`,
      load: [configuration],
      isGlobal: true,
    }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (conf: ConfigService) => ({
        middlewares: [session.middleware()],
        token: conf.get<string>('TG_BOT_KEY'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    SubjectModule,
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
