import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/signup")
  async signup(@Body() data: SignupDto) {
    try {
      return await this.authService.signup(data);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Post("/signin")
  async signin(@Body() data: LoginDto) {
    try {
      return await this.authService.signin(data);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
