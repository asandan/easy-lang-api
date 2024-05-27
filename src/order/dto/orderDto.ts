import { Role, Status } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { CommonQuery } from "src/util";

export class OrderQuery extends CommonQuery {
  name: string;

  @IsOptional()
  @IsEnum({ ...Status, ALL: "ALL" })
  status: Status

  @IsOptional()
  @IsEnum(Role)
  role: Role
}