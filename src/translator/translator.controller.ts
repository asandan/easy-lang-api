import { BadRequestException, Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { TranslatorService } from './translator.service';

@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) { }


  @Get("/:id")
  async getTranlatorStats(@Param("id", ParseIntPipe) id: number): Promise<any> {
    try {
      return await this.translatorService.getTranslatorStats(id);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
