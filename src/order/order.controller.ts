import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UploadedFiles, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { OrderQuery, UploadTranslations } from "./dto";
import { Order, Role } from "@prisma/client";
import { Response } from "express";
import { OrderService } from "./Order.service";
import { PrismaService } from "nestjs-prisma";
import { FilesInterceptor } from "@nestjs/platform-express";
import { v4 as uuidv4 } from 'uuid';
import { extname } from "path";
import { diskStorage } from "multer";


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

  @Post()
  @UseInterceptors(FilesInterceptor('images', 1000, {
    storage: diskStorage({
      destination: './storage/translations/',
      filename: (_, file, callback) => {
        const randomName = uuidv4();
        return callback(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadTranslations(@UploadedFiles() images: Express.Multer.File[], @Body(ValidationPipe) dto: UploadTranslations) {
    try {
      const imagePaths = images.map(file => ({
        path: file.path,
      }));
      console.log(dto)
      return await this.orderService.uploadTranslations(dto, imagePaths);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}