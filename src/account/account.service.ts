import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountDto } from './dto';

@Injectable()
export class AccountService {
  constructor(private readonly prismaService: PrismaService) { }

  async uploadAvatar(dto: AccountDto, filePath: string) {
    try {
      const { translatorId } = dto;

      const { accountId } = await this.prismaService.translator.findUnique({
        where: {
          id: translatorId
        },
        select: {
          accountId: true,
        }
      })

      return await this.prismaService.account.update({
        where: {
          id: accountId
        },
        data: {
          avatarPath: filePath
        }
      })
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
