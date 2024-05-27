import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Account } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) { }

  async signup(dto: SignupDto) {
    try {
      const {
        password: _password,
        ...restDto
      } = dto;

      const password = await bcrypt.hash(_password, 10);

      const payload = {
        password,
        role: "CUSTOMER",
        ...restDto
      } as Account;

      try {
        return await this.prismaService.account.create({
          data: payload,
        });
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            throw new ForbiddenException('User already exists');
          }
        }
        throw new BadRequestException(e);
      }
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async signin(dto: LoginDto) {
    try {
      const { email, password } = dto;

      const user = await this.prismaService.account.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new ForbiddenException("User doesn't exist");
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new ForbiddenException('Invalid credentials');
      }

      return user;
    } catch (e) {
      throw new Error(e);
    }
  }
}
