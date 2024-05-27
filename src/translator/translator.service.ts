import { BadRequestException, Injectable } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TranslatorService {
  constructor(private readonly prismaService: PrismaService) { }

  async getTranslatorStats(translatorId: number) {
    try {
      const { id } = await this.prismaService.translator.findUnique({
        where: {
          id: translatorId,
        },
        select: {
          id: true,
        }
      });

      if (!id) {
        throw new BadRequestException("Translator doesn't exist");
      }

      const totalOrdersCompleted = await this.prismaService.order.count({
        where: {
          translatorId,
          status: Status.TRANSLATED,
        }
      });

      const totalOrdersInProgress = await this.prismaService.order.count({
        where: {
          translatorId,
          status: Status.IN_PROGRESS,
        }
      });

      const totalOrdersOverdue = await this.prismaService.order.count({
        where: {
          translatorId,
          status: Status.OVERDUE,
        }
      });

      const totalOrders = await this.prismaService.order.count({
        where: {
          translatorId,
        }
      });

      const totalOrdersNotStarted = await this.prismaService.order.count({
        where: {
          translatorId,
          status: Status.NOT_STARTED,
        }
      });

      return {
        totalOrdersCompleted,
        totalOrdersInProgress,
        totalOrdersOverdue,
        totalOrders,
        totalOrdersNotStarted,
      }
    } catch (e) {
      throw new BadRequestException(e);
    } 
  }
}
