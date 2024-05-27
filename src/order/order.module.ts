import { PrismaService } from "nestjs-prisma";
import { OrderController } from "./order.controller";
import { OrderService } from "./Order.service";
import { Module } from "@nestjs/common";

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService]
})
export class OrderModule { }