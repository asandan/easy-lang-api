import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";

export class AccountDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  translatorId: number;
}