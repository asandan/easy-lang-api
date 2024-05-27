import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import { CommonQuery } from "src/util";

export class OrderQuery extends CommonQuery {
  name: string;

  @IsOptional()
  @IsInt()
  @Transform(({value}) => parseInt(value))
  groupId: string;
}