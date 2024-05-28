import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TranslatorModule } from './translator/translator.module';
import { AccountModule } from './account/account.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [PrismaModule,
    OrderModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TranslatorModule,
    AccountModule,
    ServeStaticModule.forRoot({
      rootPath: 'storage',
      serveRoot: '/storage',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
