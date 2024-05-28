import { BadRequestException, Injectable } from "@nestjs/common";
import { Order, Status } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { CRUDService } from "src/common/CRUDService";
import { UploadTranslations } from "./dto";

export type Files = {
  path: string,
  orderId?: number
}[]

@Injectable()
export class OrderService extends CRUDService<Order> {
  constructor(protected readonly prismaService: PrismaService) {
    super('order');
  }

  async uploadTranslations(dto: UploadTranslations, files: Files) {
    try {
      const { orderId } = dto;

      await this.prismaService.tranlation.createMany({
        data: files.map(file => ({ ...file, orderId }))
      })

      const { translatedPages, totalPages } = await this.prismaService.order.findUnique({
        where: {
          id: orderId
        },
        select: {
          translatedPages: true,
          totalPages: true,
          status: true
        }
      })

      const translatedPagesTotal = translatedPages + files.length

      if (translatedPagesTotal > totalPages) throw new BadRequestException('Cannot translate more pages than the total pages')

      if (translatedPagesTotal === totalPages) {
        return await this.prismaService.order.update({
          where: {
            id: orderId
          },
          data: {
            status: Status.TRANSLATED,
            translatedPages: translatedPagesTotal
          }
        })
      }

      if (translatedPages === 0) {
        return await this.prismaService.order.update({
          where: {
            id: orderId
          },
          data: {
            status: Status.IN_PROGRESS,
            translatedPages: translatedPagesTotal
          }
        })
      }

      return await this.prismaService.order.update({
        where: {
          id: orderId
        },
        data: {
          translatedPages: translatedPagesTotal
        }
      })
     
    } catch (e) {
      throw new BadRequestException(e)
    }
  }
}