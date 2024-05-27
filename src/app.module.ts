import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TranslatorModule } from './translator/translator.module';

@Module({
  imports: [PrismaModule, OrderModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, TranslatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
