import { BadRequestException, Controller, Get, Query, Res } from "@nestjs/common";
import { OrderQuery } from "./dto";
import { Order } from "@prisma/client";
import { Response } from "express";
import { OrderService } from "./Order.service";


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Get()
  async findAll(
    @Query() query: OrderQuery,
    @Res() res: Response,
  ): Promise<Response<Order[]>> {
    try {
      const { skip, take, sort, ...where } = query;
      return res.json(
        await this.orderService.findAll({
          skip,
          take,
          sort,
          where,
          include: {
            group: true,
            account: true,
          }
        }),
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}