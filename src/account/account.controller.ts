import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AccountService } from './account.service';
import { v4 as uuidv4 } from 'uuid';
import { AccountDto } from './dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './storage/avatars/',
      filename: (_, file, callback) => {
        const randomName = uuidv4();
        return callback(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createMedicalCertification(@UploadedFile() image: Express.Multer.File, @Body(ValidationPipe) dto: AccountDto) {
    
    try {
      return await this.accountService.uploadAvatar(dto, image.path);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

