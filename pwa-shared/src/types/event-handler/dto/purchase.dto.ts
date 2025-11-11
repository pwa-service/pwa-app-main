import {ApiProperty} from "@nestjs/swagger";
import {EventSessionDto} from "./event-session.dto";
import {IsOptional} from "class-validator";

export class PurchaseDto extends EventSessionDto {
    @ApiProperty()
    @IsOptional()
    value!: number;

    @ApiProperty()
    @IsOptional()
    currency!: string;
}