import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query, Res } from "@nestjs/common";
import { OrderQuery } from "./dto";
import { Order, Role } from "@prisma/client";
import { Response } from "express";
import { OrderService } from "./Order.service";
import { PrismaService } from "nestjs-prisma";


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly prismaService: PrismaService) { }

  @Get("/:userId")
  async findAll(
    @Query() query: OrderQuery,
    @Res() res: Response,
    @Param("userId", ParseIntPipe) userId: string,
  ): Promise<Response<Order[]>> {
    try {
      const { skip, take, sort, role, ..._where } = query;

      const where: any = {
        ..._where,
      };

      if (role === Role.CUSTOMER) {
        where.customerId = Number(userId);
      } else {
        where.translatorId = Number(userId);
      }

      return res.json(
        await this.orderService.findAll({
          skip,
          take,
          sort,
          where,
          include: {
          }
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}