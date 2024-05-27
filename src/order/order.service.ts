import { Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";

@Injectable()
export class OrderService extends CRUDService<Order> {
  constructor(protected readonly prismaService: PrismaService) {
    super('order');
  }
}